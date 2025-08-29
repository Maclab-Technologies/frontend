import Image from "next/image";
import logo59 from "/public/images/brandimage.jpeg";
const About = () => {
  return (
    <div className="bg-black min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-center min-h-[300px] min-w-[200px] bg-yellow-400  mx-auto">
        <h1 className="font-bold text-black text-4xl">About Us</h1>
      </div>

      {/* About Content Section */}
      <div className="bg-black text-white py-10">
        <section className="container mx-auto px-6 space-y-16">
          {/* Section 1 */}
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <p className="md:w-1/2 leading-relaxed text-lg">
              At <span className="font-bold text-yellow-400">59 Minutes Print</span>, we believe in speed, quality, and convenience. We are Nigeria's leading online printing service, dedicated to helping businesses and individuals bring their ideas to life with premium, high-quality prints.
            </p>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src={logo59}
                alt="59 Minutes Print Logo"
                width={150}
                height={150}
                className=""
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <div className="md:w-1/2 flex justify-center">
              <Image
                src={logo59}
                alt="59 Minutes Print Logo"
                width={150}
                height={150}
                className=""
              />
            </div>
            <p className="md:w-1/2 leading-relaxed text-lg">
              With a strong network of trusted printing partners and efficient logistics, we ensure that every order is processed with care, precision, and timeliness. Whether it's a small batch or a large-scale print run, we deliver exceptional results at competitive rates.
            </p>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <p className="md:w-1/2 leading-relaxed text-lg">
              Our mission is simple: to make printing easy, fast, and accessible for all. We are passionate about empowering businesses with world-class printing solutions that drive brand visibility and success.
            </p>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src={logo59}
                alt="59 Minutes Print Logo"
                width={150}
                height={150}
                className=""
              />
            </div>
          </div>
        </section>
      </div>
      <section className="bg-black text-white py-10">
        {/* Banner Section */}
        <div className="bg-yellow-600 text-black font-bold text-lg text-center py-4">
          Join thousands of satisfied customers and let’s print something amazing together!
        </div>

        {/* Special Offers Section */}
        <div className="text-center my-10">
          <h2 className="text-2xl font-bold">Special Offers & Discounts!</h2>
          <div className="bg-yellow-800 text-yellow-400 p-6 mt-4 rounded-lg">
            <p className="font-semibold">
              Combo Deals for Businesses & Events! Save more when you order in bulk.
            </p>
            <p className="font-semibold">Exclusive 10% Off for First-Time Customers!</p>
            <p>Try us today & experience top-notch printing.</p>
          </div>
        </div>

        {/* Order Now Section */}
        <div className="text-center my-10">
          <h2 className="text-2xl font-bold">Order Now & Get It Delivered!</h2>
          <p className="mt-4">
            Don’t wait! Experience Nigeria’s most efficient online printing service today.
          </p>
          <p>Click the button below to place your order now!</p>
          <button className="bg-yellow-400 text-black font-bold py-2 px-6 mt-4 rounded-lg">
            PLACE ORDER NOW
          </button>
        </div>

        {/* High-Quality Prints Section */}
        <div className="text-center my-10">
          <h2 className="text-2xl font-bold">
            Get High-Quality Prints Delivered in Record Time!
          </h2>
          <p className="mt-4">
            Need fast, top-quality prints for your business or event? We’ve got you covered!
            From corporate branding materials to event banners, we print and deliver with speed
            and precision.
          </p>
          <p>
            With our 59-minute express service available in select cities, you never have to
            miss a deadline again!
          </p>
        </div>
      </section>

      {/* Why You Choose Us Section */}
      <section className="bg-black text-white px-8 py-16">
        {/* Header */}
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

        {/* "Why Choose Us?" Button */}
        <div className="text-center mb-12">
          <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md">
            Why Choose Us?
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
          {/* Lightning-Fast Delivery */}
          <div className="flex flex-col items-center text-center">
            <span className="text-yellow-500 text-5xl mb-4">🚚</span>
            <h3 className="font-bold text-lg mb-2">Lightning-Fast Delivery</h3>
            <p className="text-gray-300">
              Get select prints in as fast as 59 minutes in Lagos, Abuja, Asaba & Anambra.
            </p>
          </div>

          {/* Affordable & Transparent Pricing */}
          <div className="flex flex-col items-center text-center">
            <span className="text-yellow-500 text-5xl mb-4">💰</span>
            <h3 className="font-bold text-lg mb-2">Affordable & Transparent Pricing</h3>
            <p className="text-gray-300">
              No hidden charges. Get premium prints without breaking the bank.
            </p>
          </div>

          {/* Premium Quality Guaranteed */}
          <div className="flex flex-col items-center text-center">
            <span className="text-yellow-500 text-5xl mb-4">🏆</span>
            <h3 className="font-bold text-lg mb-2">Premium Quality Guaranteed</h3>
            <p className="text-gray-300">
              Sharp, vibrant, and professional-grade prints for all your needs.
            </p>
          </div>

          {/* Bulk & Custom Orders */}
          <div className="flex flex-col items-center text-center">
            <span className="text-yellow-500 text-5xl mb-4">📦</span>
            <h3 className="font-bold text-lg mb-2">Bulk & Custom Orders</h3>
            <p className="text-gray-300">
              Whether you need one print or thousands, we handle it all seamlessly.
            </p>
          </div>

          {/* Hassle-Free Online Ordering */}
          <div className="flex flex-col items-center text-center">
            <span className="text-yellow-500 text-5xl mb-4">🛒</span>
            <h3 className="font-bold text-lg mb-2">Hassle-Free Online Ordering</h3>
            <p className="text-gray-300">
              Order from anywhere and get it delivered to your doorstep.
            </p>
          </div>

          {/* Eco-Friendly Printing */}
          <div className="flex flex-col items-center text-center">
            <span className="text-yellow-500 text-5xl mb-4">🌱</span>
            <h3 className="font-bold text-lg mb-2">Eco-Friendly Printing</h3>
            <p className="text-gray-300">
              We use sustainable materials and eco-friendly processes for a greener planet.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="bg-black text-white px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Feedback Section */}
          <div>
            <h2 className="bg-yellow-500 text-black font-bold text-center py-2 rounded-md mb-8">Feedback</h2>
            <form className="space-y-6">
              {/* First Name and Last Name Row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Firstname</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2  rounded-lg text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Lastname</label>
                  <input
                    type="text"
                    placeholder="Last Name "
                    className="w-full px-4 py-2  rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2  rounded-lg text-white"
                />
              </div>

              {/* Label Text Area */}
              <div>
                <label className="block mb-2 font-semibold">Message</label>
                <textarea
                  placeholder="Message"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white h-32"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-600"
              >
                Send Feedback
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="bg-yellow-500 text-black font-bold text-center py-2  mb-8">FAQ</h2>
            <div className="space-y-4">
              <p>Figma ipsum component variant main layer.</p>
              <p>Pen draft text object clip mask flows main prototype component.</p>
              <p>Undo hand fig jam asset text opacity horizontal effect.</p>
              <p>Resizing duplicate arrow scrolling arrow.</p>
              <p>Move thumbnail union flatten component team resizing vector.</p>
              <p>Scale frame vertical link layout clip inspect library.</p>
              <p>Align component polygon bullet flows flow's font device line.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 text-black py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>

      {/* Contact Info Section */}
      <div className="text-center mb-10">
        <p className="text-lg font-medium">We’d love to hear from you!</p>
        <p>Feel free to visit us or reach out anytime for inquiries and support.</p>
      </div>

      {/* Google Map Embed */}
      <div className="flex justify-center items-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126093.78244294495!2d7.367465157320973!3d9.024416368195467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e745f4cd62fd9%3A0x53bd17b4a20ea12b!2sAbuja%2C%20Federal%20Capital%20Territory!5e0!3m2!1sen!2sng!4v1739989753500!5m2!1sen!2sng"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </section>
    </div>
  );
};

export default About;
