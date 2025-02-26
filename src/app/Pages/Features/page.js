export default function Features() {
    return (
      <>
        {/* Design Features Section */}
        <section className="bg-black text-white px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Design Features</h2>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Upload Your Design */}
            <div className="bg-yellow-500 rounded-lg p-6 text-center">
              <span className="text-black text-5xl mb-4 block">⬆️</span>
              <h3 className="text-black font-bold text-lg mb-2">Upload your design</h3>
              <p className="text-black mb-4">Figma ipsum component variant main layer.</p>
              <button className="bg-black text-yellow-500 font-bold py-2 px-4 rounded-md">
                Upload
              </button>
            </div>
  
            {/* Hire a Graphics Designer */}
            <div className="border border-yellow-500 rounded-lg p-6 text-center">
              <span className="text-yellow-500 text-5xl mb-4 block">👥</span>
              <h3 className="font-bold text-lg mb-2">Hire a Graphics Designer</h3>
              <p className="text-gray-300 mb-4">Figma ipsum component variant main layer.</p>
              <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-md">
                Hire Now
              </button>
            </div>
  
            {/* Design with Canvas */}
            <div className="border border-yellow-500 rounded-lg p-6 text-center">
              <span className="text-yellow-500 text-5xl mb-4 block">🖼️</span>
              <h3 className="font-bold text-lg mb-2">Design with Canvas</h3>
              <p className="text-gray-300 mb-4">Figma ipsum component variant main layer.</p>
              <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-md">
                Design Now
              </button>
            </div>
          </div>
        </section>
        {/* Advert Section  */}


        <section className="bg-white text-black  h-[30]">
          <div className="mx-auto ">
           <h2>This Advertisemnet and Sponsorship section </h2> 
           <button>Shop Now</button>
          </div>
        </section>
        {/* "Why Choose Us" Section */}
        <section className="bg-black text-white px-8 py-16 ">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Get High-Quality Prints Delivered in Record Time!
            </h2>
            <p className="text-gray-300">
              Need fast, top-quality prints for your business or event? We’ve got you
              covered! From corporate branding materials to event banners, we print and
              deliver with speed and precision. With our 59-minute express service
              available in select cities, you never have to miss a deadline again!
            </p>
          </div>
  
          <div className="text-center mb-12">
            <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md">
              Why Choose Us?
            </button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
            {[
              { icon: "🚚", title: "Lightning-Fast Delivery", description: "Get select prints in as fast as 59 minutes in Lagos, Abuja, Asaba & Anambra." },
              { icon: "💰", title: "Affordable & Transparent Pricing", description: "No hidden charges. Get premium prints without breaking the bank." },
              { icon: "🏆", title: "Premium Quality Guaranteed", description: "Sharp, vibrant, and professional-grade prints for all your needs." },
              { icon: "📦", title: "Bulk & Custom Orders", description: "Whether you need one print or thousands, we handle it all seamlessly." },
              { icon: "🛒", title: "Hassle-Free Online Ordering", description: "Order from anywhere and get it delivered to your doorstep." },
              { icon: "🌱", title: "Eco-Friendly Printing", description: "We use sustainable materials and eco-friendly processes for a greener planet." }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <span className="text-yellow-500 text-5xl mb-4">{feature.icon}</span>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }
  