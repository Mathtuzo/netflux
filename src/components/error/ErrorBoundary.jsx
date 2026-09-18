import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Netflux ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: '#0a101d',
          color: '#ffffff',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'rgba(0, 51, 98, 0.35)',
            border: '1px solid #005fa3',
            borderRadius: '16px',
            padding: '36px 28px',
            maxWidth: '520px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 110, 194, 0.25)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎬</div>
            <h2 style={{
              margin: '0 0 10px 0',
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Un problème d'affichage est survenu
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Ne vous inquiétez pas, le catalogue Netflux reste accessible. Vous pouvez recharger la page ou revenir à l'accueil.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #005fa3 0%, #003362 100%)',
                  border: '1px solid #0090ff',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: '24px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 110, 194, 0.4)'
                }}
              >
                🔄 Réessayer
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#e2e8f0',
                  padding: '10px 22px',
                  borderRadius: '24px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🏠 Revenir à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
