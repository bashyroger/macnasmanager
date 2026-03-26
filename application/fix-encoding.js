const fs = require("fs");
const path = require("path");

const typesFile = path.join(__dirname, "lib", "supabase", "database.types.ts");
let content = fs.readFileSync(typesFile, "utf16le");

if (!content.startsWith("export")) {
  content = fs.readFileSync(typesFile, "utf8");
}

let modified = false;

// Remove __InternalSupabase
if (content.match(/__InternalSupabase/)) {
  content = content.replace(/__InternalSupabase:\s*\{\s*PostgrestVersion:\s*["'][^"']+["']\s*\}\s*/, "");
  modified = true;
}

// Inject google_tokens only
if (!content.includes("google_tokens:")) {
  const replacement = `        Relationships: []
      }
      google_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string | null
          refresh_token: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token?: string | null
          refresh_token: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string | null
          refresh_token?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      material_sustainability_scores: {`;
  content = content.replace(/        Relationships: \[\]\s*\}\s*material_sustainability_scores: \{/, replacement);
  modified = true;
}

if (modified) {
  fs.writeFileSync(typesFile, content, "utf8");
  console.log("Encoded natively to UTF-8 and injected google_tokens.");
} else {
  console.log("No modifications needed.");
}
