export async function POST(request: Request) {
    try {
        const cookie = request.headers.get("cookie") || "";
        const sessionToken = cookie?.split("session=")[1]?.split(";")[0];

        if (!sessionToken) {
            return new Response(JSON.stringify({ success: false, error: "No session token found" }), { status: 400 });
        }
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Set-Cookie": "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;",
            },
        });
    }
    catch (error) {
        console.error("Error logging out:", error instanceof Error ? error.message : String(error));
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}
