import Reviewsec from "./Reviewsec";

function Assess() {
    return (
        <>
            <Reviewsec />
            <div className="bg-gradient-to-r from-[hsl(217_96%_70%)]  to-[hsl(100_50%_56%)] w-full px-4 py-10 sm:py-16 flex flex-col items-center text-center font-roboto">
                <p className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white max-w-4xl">
                    Ready to Transform Your Athletic Performance?
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white mt-4 max-w-xl font-sans">
                    Join thousands of athletes who have already optimized their training with personalized plans from FitFusion.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <a
                        href="#"
                        className="bg-white text-blue-700 text-base sm:text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-100 transition"
                    >
                        Start Free Assessment
                    </a>
                    <a
                        href="#"
                        className="bg-white text-blue-700 text-base sm:text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-100 transition"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </>
    );
}

export default Assess;
