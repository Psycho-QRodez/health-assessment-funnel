"use client";

export default function ApiTestPage() {
  async function testApi() {
    const response = await fetch(
      "/api/session/start",
      {
        method: "POST",
      }
    );

    const data = await response.json();

    console.log(data);

    alert(JSON.stringify(data));
  }

  return (
    <main
      style={{
        padding: "40px",
      }}
    >
      <h1>API Test Page</h1>

      <button
        onClick={testApi}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        Create Session
      </button>
    </main>
  );
}