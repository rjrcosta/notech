export function Unauthorized()  {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-red-500">403 - Access Denied</h1>
          <p className="mt-4 text-lg">You don't have permission to access this page.</p>
        </div>
      </div>
    );

}  
  
export default Unauthorized;