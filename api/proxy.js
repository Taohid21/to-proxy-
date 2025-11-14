// পুরোনো কোড ডিলিট করে এটি পেস্ট করুন

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response('Error: Please provide a "url" query parameter.', {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    // একটি নতুন Headers অবজেক্ট তৈরি করা হচ্ছে
    const headers = new Headers(request.headers);
    
    // ★★★ মূল পরিবর্তন: একটি বাস্তব ব্রাউজারের User-Agent যোগ করা হয়েছে ★★★
    // এটি ভিডিও সার্ভারকে বোঝাবে যে অনুরোধটি একটি সাধারণ ব্রাউজার থেকে আসছে
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    // কিছু সার্ভারের জন্য অরিজিন এবং রেফারার হেডার মুছে ফেলা প্রয়োজন হতে পারে
    headers.delete('origin');
    headers.delete('referer');

    // নতুন হেডারসহ মূল URL থেকে ডেটা আনা হচ্ছে
    const fetchResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      redirect: 'follow',
    });

    // একটি নতুন Response তৈরি করা হচ্ছে, যা আমরা ব্রাউজারে ফেরত পাঠাব
    const proxyResponse = new Response(fetchResponse.body, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: fetchResponse.headers,
    });

    // CORS হেডার যোগ করা হচ্ছে
    proxyResponse.headers.set("Access-Control-Allow-Origin", "*");
    proxyResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    proxyResponse.headers.set("Access-Control-Allow-Headers", "*");

    return proxyResponse;

  } catch (error) {
    return new Response(`Error fetching the URL: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
