import { getGoogleOAuthClient } from "@/lib/google-calendar";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const origin = requestUrl.origin;

  if (error) {
    return NextResponse.redirect(`${origin}/app/settings/integrations?error=${error}`);
  }

  if (code) {
    try {
      const oauth2Client = getGoogleOAuthClient();
      const { tokens } = await oauth2Client.getToken(code);

      // The refresh token is only returned on the first authorization.
      if (!tokens.refresh_token) {
        console.warn("No refresh token received. We need a refresh token to sync offline.");
        // Usually you can redirect user to settings with a warning, or proceed.
        // We force prompt="consent" during generateAuthUrl so it should always return.
      }

      // We need to securely store this token against the active admin user.
      const supabase = await createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        throw new Error("Must be logged in to connect Google Calendar.");
      }

      const userId = userData.user.id;

      // Upsert into google_tokens table
      const { error: dbError } = await supabase
        .from("google_tokens")
        .upsert({
          user_id: userId,
          access_token: tokens.access_token ?? null,
          refresh_token: tokens.refresh_token ?? "", // if user re-auths, we might not get a new refresh token if we don't handle it
          expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        }, { onConflict: "user_id" });

      if (dbError) {
        if (dbError.code === "23502" && !tokens.refresh_token) {
            // Null constraint on refresh_token if the user already granted access previously and didn't force consent.
            return NextResponse.redirect(`${origin}/app/settings/integrations?error=No_Refresh_Token_Received`);
        }
        throw dbError;
      }

      return NextResponse.redirect(`${origin}/app/settings/integrations?success=connected`);
    } catch (err: any) {
      console.error("Error exchanging OAuth code:", err);
      return NextResponse.redirect(`${origin}/app/settings/integrations?error=OAuth_Exchange_Failed`);
    }
  }

  return NextResponse.redirect(`${origin}/app/settings/integrations`);
}
