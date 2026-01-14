import os
import time
import bcrypt
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class SupabaseService:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.client: Optional[Client] = None
        
        if self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                print("✅ Supabase Service Initialized")
            except Exception as e:
                print(f"❌ Failed to init Supabase Service: {e}")
        else:
            print("❌ Missing SUPABASE_URL or SUPABASE_KEY")

    def create_user(self, username: str, password: str) -> Optional[str]:
        """
        Creates a new user with hashed password.
        Returns user_id if successful, None if failed (e.g., username taken).
        """
        if not self.client: return None

        # Hash password
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

        try:
            data = {
                "username": username,
                "password_hash": password_hash
            }
            # 'users' table must exist with id, username, password_hash
            response = self.client.table("users").insert(data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['id']
            return None
        except Exception as e:
            print(f"❌ Create User Failed: {e}")
            return None

    def login_user(self, username: str, password: str) -> Optional[str]:
        """
        Verifies credentials.
        Returns user_id if valid, None otherwise.
        """
        if not self.client: return None

        try:
            response = self.client.table("users").select("id, password_hash").eq("username", username).execute()
            
            if not response.data:
                return None
            
            user = response.data[0]
            stored_hash = user['password_hash'].encode('utf-8')
            
            if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
                return user['id']
            return None
        except Exception as e:
            print(f"❌ Login Failed: {e}")
            return None

    def save_score(self, user_id: str, score: int, time_left: int, status_val: str = "won", difficulty: str = "Medium", city_target: str = "Unknown"):
        """
        Records a game session score with difficulty and target city.
        """
        if not self.client: return

        try:
            data = {
                "user_id": user_id,
                "score": score,
                "time_remaining": time_left,
                "status": status_val,
                "difficulty": difficulty,
                "city_target": city_target
            }
            self.client.table("game_sessions").insert(data).execute()
        except Exception as e:
            print(f"❌ Save Score Failed: {e}")

    async def get_user_streak(self, user_id: str) -> int:
        """
        Calculates the current winning streak for a user.
        Counts consecutive 'won' statuses from the most recent game backwards.
        """
        if not self.client: return 0
        
        try:
            # Fetch last 20 games for the user to check checks
            # Ordered by played_at desc
            resp = self.client.table("game_sessions").select("status").eq("user_id", user_id).order("played_at", desc=True).limit(20).execute()
            
            streak = 0
            for row in resp.data:
                # IMPORTANT: Status is case-sensitive 'won' driven by previous fix
                if row.get('status') == 'won':
                    streak += 1
                else:
                    # Streak broken
                    break
            return streak
        except Exception as e:
            print(f"❌ Streak Check Failed: {e}")
            return 0
            
    def get_leaderboard(self, limit: int = 10, region: str = "GLOBAL") -> List[Dict[str, Any]]:
        """
        Returns top players by total score, filtered by region (INDIA or GLOBAL).
        Region logic:
        - INDIA: difficulty contains 'INDIA'
        - GLOBAL: difficulty does NOT contain 'INDIA'
        """
        if not self.client: return []

        try:
            # Fetch sessions with score > 0
            # Limit fetch to last 1000 sessions to avoid memory issues
            # We select "difficulty" now too
            # Use 'played_at' as seen in user screenshot
            resp = self.client.table("game_sessions").select("user_id, score, difficulty").order("played_at", desc=True).limit(2000).execute()
            
            if not resp.data:
                return []
            
            # Aggregate based on region filter
            user_scores = {}
            user_games = {}
            
            for row in resp.data:
                uid = row.get('user_id')
                if not uid: continue
                
                # Filter Logic
                row_diff = row.get('difficulty', 'Medium') or 'Medium' # Handle None
                if region == "INDIA":
                    if "INDIA" not in row_diff: continue
                else: # GLOBAL (aka non-India specific)
                    if "INDIA" in row_diff: continue

                s = row.get('score', 0)
                user_scores[uid] = user_scores.get(uid, 0) + s
                
                # Track max score
                current_max = user_games.get(f"{uid}_max", 0)
                if s > current_max:
                    user_games[f"{uid}_max"] = s
                    
                user_games[uid] = user_games.get(uid, 0) + 1
                
            # Sort
            sorted_users = sorted(user_scores.items(), key=lambda x: x[1], reverse=True)[:limit]
            
            results = []
            for uid, param_total_score in sorted_users:
                # Fetch username
                # Inefficient N+1 query but reliable without join syntax knowledge
                # Optimization: Fetch all needed users in one IN query
                u_resp = self.client.table("users").select("username").eq("id", uid).execute()
                if u_resp.data:
                    username = u_resp.data[0]['username']
                    results.append({
                        "username": username,
                        "total_score": param_total_score,
                        "games_played": user_games[uid],
                        "best_mission": user_games.get(f"{uid}_max", 0)
                    })
            
            return results
            
        except Exception as e:
            print(f"❌ Leaderboard Failed: {e}")
            return []

# Singleton instance
db_service = SupabaseService()
