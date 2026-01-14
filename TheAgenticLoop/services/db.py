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

    def save_score(self, user_id: str, score: int, time_left: int, status_val: str = "completed"):
        """
        Records a game session score.
        """
        if not self.client: return

        try:
            data = {
                "user_id": user_id,
                "score": score,
                "time_remaining": time_left,
                "status": status_val
            }
            self.client.table("game_sessions").insert(data).execute()
        except Exception as e:
            print(f"❌ Save Score Failed: {e}")

    def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Returns top players by total score.
        Since we might not have a view, we'll try to fetch aggregated data if possible,
        or fetch raw sessions and aggregate in python (less efficient but reliable without creating SQL views).
        
        However, for a real leaderboard, we usually want:
        SELECT users.username, SUM(game_sessions.score) as total_score 
        FROM game_sessions 
        JOIN users ON game_sessions.user_id = users.id 
        GROUP BY users.username 
        ORDER BY total_score DESC
        
        Supabase-js client doesn't support aggregate+group_by easily without a view.
        We will assume there is NO view.
        We will fetch all game sessions (up to a reasonable limit) and aggregate in Python?
        Or better: Fetch `users` and `game_sessions` and map them.
        
        Actually, for now, let's implement a simpler "Latest High Scores" or similar if we can't do complex SQL.
        But the requirement is "Sum of score grouped by user_id".
        
        Best approach without SQL view access: 
        1. Fetch all game_sessions (with `select=user_id,score`).
        2. Aggregate in Python.
        3. Fetch usernames for the top user_ids.
        This is not scalable for millions of rows, but for this project it's fine.
        """
        if not self.client: return []

        try:
            # Fetch sessions with score > 0
            # Limit fetch to last 1000 sessions to avoid memory issues
            resp = self.client.table("game_sessions").select("user_id, score").order("created_at", desc=True).limit(1000).execute()
            
            if not resp.data:
                return []
            
            # Aggregate
            user_scores = {}
            user_games = {}
            for row in resp.data:
                uid = row.get('user_id')
                if not uid: continue
                s = row.get('score', 0)
                user_scores[uid] = user_scores.get(uid, 0) + s
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
                        "games_played": user_games[uid]
                    })
            
            return results
            
        except Exception as e:
            print(f"❌ Leaderboard Failed: {e}")
            return []

# Singleton instance
db_service = SupabaseService()
