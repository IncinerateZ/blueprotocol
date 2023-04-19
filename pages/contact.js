export default function contact() {
    return (
        <div style={{ margin: '2rem' }}>
            <h1>ONLY IMPORTANT AND RELEVANT MATTERS WILL BE RESPONDED TO</h1>
            <p>Discord: IncinerateZ#4038</p>
            <p>Email: admin@incin.net</p>
            <div
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => {
                    window.location = './';
                }}
            >
                Back to Homepage
            </div>
        </div>
    );
}
