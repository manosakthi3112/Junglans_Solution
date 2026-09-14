import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Junglans Application Caught Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] flex items-center justify-center p-6 bg-precision-grid">
          <div className="max-w-xl w-full bg-white border-2 border-[#A7F3D0] rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] p-2 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
              <img
                src="/squirrel_logo-128.webp"
                alt="Junglans Solutions"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider mb-2">
              JUNGLANS ECOSYSTEM // RECOVERY PROTOCOL
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-3">
              Application Notice
            </h1>
            <p className="font-body text-sm text-slate-600 mb-6 leading-relaxed">
              The application encountered a transient client state error. Click below to restore the ecosystem view immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow-md"
              >
                Reload Application Home ↺
              </button>
              <a
                href="/packages"
                className="w-full sm:w-auto bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-bold px-6 py-3 rounded-xl hover:bg-[#10B981] hover:text-white transition"
              >
                Explore Packages & Docs ↗
              </a>
            </div>
            {this.state.error && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-slate-600 overflow-x-auto">
                <div className="font-bold text-red-500 mb-1">Diagnostic Info:</div>
                <div>{this.state.error.toString()}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
