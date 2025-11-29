const { processAllDailyPayments } = "../../convex/_generated/server.js";

export const handler = async (event, context) => {
  try {
    // Initialize Convex client with the context
    const { CONVEX_URL, CONVEX_DEPLOYMENT_KEY } = process.env;

    if (!CONVEX_URL || !CONVEX_DEPLOYMENT_KEY) {
      console.error("Missing Convex environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" })
      };
    }

    const convexUrl = CONVEX_URL;

    // Call the daily payment processing function
    const response = await fetch(`${convexUrl}/api/actions/dailyPayments/processAllDailyPayments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONVEX_DEPLOYMENT_KEY}`
      },
      body: JSON.stringify({})
    });

    const result = await response.json();

    console.log("Daily payment processing completed:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        processed: result.length || 0,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error("Daily payment processing failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};