import { LogoutButton } from "./logout-button";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f7] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e5e0d8] shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#1a1714] mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-8">
          Your Google account is not authorized to access the Studio Macnas dashboard. Please contact the administrator.
        </p>
        <LogoutButton />
      </div>
    </main>
  );
}
