import VendorNavLayout from "../layout/vendor-layout"

const Layout = (children) =>  {
    return (
        <div>
            <VendorNavLayout />
            <div className="p-4 lg:p-6">
                {/* Main content goes here */}
                {children}
            </div>
        </div>
    )
}

export default Layout