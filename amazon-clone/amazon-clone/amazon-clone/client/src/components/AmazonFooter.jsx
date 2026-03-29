import "./AmazonFooter.css";

function AmazonFooter() {
    return (
        <footer className="amazon-footer" aria-label="Amazon footer">
            <a className="footer-back-top" href="#top">
                Back to top
            </a>

            <div className="footer-main">
                <div className="footer-main-inner">
                    <section>
                        <h4>Get to Know Us</h4>
                        <a href="#">About Amazon</a>
                        <a href="#">Careers</a>
                        <a href="#">Press Releases</a>
                        <a href="#">Amazon Science</a>
                    </section>

                    <section>
                        <h4>Connect with Us</h4>
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                    </section>

                    <section>
                        <h4>Make Money with Us</h4>
                        <a href="#">Sell on Amazon</a>
                        <a href="#">Sell under Amazon Accelerator</a>
                        <a href="#">Protect and Build Your Brand</a>
                        <a href="#">Amazon Global Selling</a>
                        <a href="#">Supply to Amazon</a>
                        <a href="#">Become an Affiliate</a>
                        <a href="#">Fulfilment by Amazon</a>
                        <a href="#">Advertise Your Products</a>
                        <a href="#">Amazon Pay on Merchants</a>
                    </section>

                    <section>
                        <h4>Let Us Help You</h4>
                        <a href="#">Your Account</a>
                        <a href="#">Returns Centre</a>
                        <a href="#">Recalls and Product Safety Alerts</a>
                        <a href="#">100% Purchase Protection</a>
                        <a href="#">Amazon App Download</a>
                        <a href="#">Help</a>
                    </section>
                </div>
            </div>

            <div className="footer-mid">
                <div className="footer-mid-inner">
                    <a className="footer-logo" href="#" aria-label="Amazon">
                        amazon
                    </a>

                    <div className="footer-mid-controls">
                        <button type="button" aria-label="Language">
                            English
                        </button>
                        <button type="button" aria-label="Country">
                            India
                        </button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <div className="footer-services-grid">
                        <a href="#">
                            <strong>AbeBooks</strong>
                            <span>Books, art &amp; collectibles</span>
                        </a>
                        <a href="#">
                            <strong>Amazon Web Services</strong>
                            <span>Scalable Cloud Computing Services</span>
                        </a>
                        <a href="#">
                            <strong>Audible</strong>
                            <span>Download Audio Books</span>
                        </a>
                        <a href="#">
                            <strong>IMDb</strong>
                            <span>Movies, TV &amp; Celebrities</span>
                        </a>
                        <a href="#">
                            <strong>Shopbop</strong>
                            <span>Designer Fashion Brands</span>
                        </a>
                        <a href="#">
                            <strong>Amazon Business</strong>
                            <span>Everything For Your Business</span>
                        </a>
                        <a href="#">
                            <strong>Prime Music</strong>
                            <span>100 million songs, ad-free</span>
                        </a>
                    </div>

                    <div className="footer-legal">
                        <div className="footer-legal-links">
                            <a href="#">Conditions of Use &amp; Sale</a>
                            <a href="#">Privacy Notice</a>
                            <a href="#">Interest-Based Ads</a>
                        </div>
                        <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default AmazonFooter;
