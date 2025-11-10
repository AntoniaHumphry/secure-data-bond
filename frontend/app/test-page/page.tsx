export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SecureData Test Page</h1>
      <p>This is a simple test page to verify Next.js is working.</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>System Status</h2>
        <ul>
          <li>✅ Next.js is running</li>
          <li>✅ Basic rendering works</li>
          <li>⏳ Testing FHEVM integration...</li>
        </ul>
      </div>
    </div>
  );
}
