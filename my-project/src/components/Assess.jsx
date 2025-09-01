import Reviewsec from "./Reviewsec";

function Assess() {
    return (
        <>
            <Reviewsec />
            <div class="bg-gradient-to-r from-[hsl(217,96%,70%)] to-[hsl(100,50%,56%)] w-full px-4 py-16 sm:py-20 flex flex-col items-center text-center">
        <p class="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white max-w-4xl leading-tight sm:leading-snug">
            Ready to Transform Your Athletic Performance?
        </p>
        <p class="text-lg sm:text-xl text-white mt-6 max-w-2xl font-light opacity-95">
            Join thousands of athletes who have already optimized their training with personalized plans from FitFusion.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
            <a
                href="#"
                class="bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50"
            >
                Start Free Assessment
            </a>
            <a
                href="#"
                class="bg-transparent border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
                Learn More
            </a>
        </div>
        
      
        <div class="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
            <div class="text-center">
                <p class="text-4xl font-bold text-white">10K+</p>
                <p class="text-white/90 text-sm mt-2">ACTIVE ATHLETES</p>
            </div>
            <div class="text-center">
                <p class="text-4xl font-bold text-white">95%</p>
                <p class="text-white/90 text-sm mt-2">SATISFACTION RATE</p>
            </div>
            <div class="text-center">
                <p class="text-4xl font-bold text-white">27</p>
                <p class="text-white/90 text-sm mt-2">SPORTS COVERED</p>
            </div>
        </div>
    </div>

  
  
        </>
    );
}

export default Assess;
