export function Support() {
  return (
    <section className="bg-primary py-12 text-white md:py-16 lg:py-24">
      <div className="container px-4 mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:mb-6 md:text-4xl lg:text-6xl">
            Support Our Mission
          </h2>
          <p className="mb-6 text-base text-white/90 sm:text-lg md:mb-8">
            Your support helps us continue our work in the community. Every
            contribution makes a difference.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm sm:p-6">
              <h3 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
                Fundraise
              </h3>
              <p className="mb-4 text-sm text-white/80 sm:text-base">
                Start your own fundraising campaign to support our causes
              </p>
              <button className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-white/90 sm:px-6 sm:py-3 sm:text-base">
                Start Fundraising
              </button>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm sm:p-6">
              <h3 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
                Sponsor
              </h3>
              <p className="mb-4 text-sm text-white/80 sm:text-base">
                Partner with us to make a lasting impact in the community
              </p>
              <button className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-white/90 sm:px-6 sm:py-3 sm:text-base">
                Become a Sponsor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
