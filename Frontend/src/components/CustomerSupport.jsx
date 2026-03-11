import React from 'react';
import '../css/CustomerSupport.css';
import Header from './header';
// import Footer from './Footer';

const CustomerSupport = () => {
    return (
        <>
            <Header />
            <div className="support-page">
               
                <div className="support-hero">
                    <h1>How Can We Help You?</h1>
                    <p>We're here to assist you with any questions or concerns</p>
                </div>

                {/* Quick Contact Cards */}
                <div className="quick-contact-section">
                    <div className="contact-card">
                        <div className="contact-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </div>
                        <h3>Call Us</h3>
                        <p>+91 987456524</p>
                        <span className="availability">Mon-Sat: 9AM - 8PM</span>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <h3>Email Us</h3>
                        <p>sneakify@shoestore.com</p>
                        <span className="availability">Response within 24 hours</span>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <h3>Live Chat On What'sapp</h3>
                        <p>Chat with our team</p>
                        <p>Contact Us On 9654781452</p>
                        <span className="availability">Available now</span>
                    </div>

                    <div className="contact-card">
                        <div className="contact-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <h3>Visit Us</h3>
                        <p>123 Shoe Street, Ahmedabad</p>
                        <span className="availability">Mon-Sat: 10AM - 9PM</span>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    
                    <div className="faq-category">
                        <h3 className="category-title">Orders & Shipping</h3>
                        
                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>How long does shipping take?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Standard shipping takes 3-5 business days. Express shipping is available for delivery within 1-2 business days. Free shipping on orders above ₹999.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>Can I track my order?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can track your order in real-time through our website.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>Do you ship internationally?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Currently, we only ship within India. International shipping will be available soon. Stay tuned!</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-category">
                        <h3 className="category-title">Returns & Exchanges</h3>
                        
                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>What is your return policy?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>We offer a 30-day return policy. Items must be unused, in original packaging with tags attached. Free return shipping for defective items.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>How do I exchange a product?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Contact our support team with your order number. We'll arrange a pickup and send you the replacement size or color within 3-5 business days.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>When will I get my refund?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-category">
                        <h3 className="category-title">Product & Sizing</h3>
                        
                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>How do I find the right shoe size?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Check our detailed size guide on each product page. Measure your foot length and match it with our size chart. If between sizes, we recommend sizing up.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>Are the shoes authentic?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Yes! All our shoes are 100% authentic and sourced directly from authorized brand distributors. Each product comes with authenticity guarantee.</p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <span className="faq-icon">Q</span>
                                <h4>Do you have a warranty?</h4>
                            </div>
                            <div className="faq-answer">
                                <p>Yes, all shoes come with a 6-month manufacturer warranty against defects. This covers manufacturing faults but not regular wear and tear.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Features */}
                <div className="support-features">
                    <div className="feature-box">
                        <div className="feature-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Our customer service team is available round the clock to assist you</p>
                    </div>

                    <div className="feature-box">
                        <div className="feature-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3>Secure Shopping</h3>
                        <p>Your payment information is encrypted and completely secure</p>
                    </div>

                    <div className="feature-box">
                        <div className="feature-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </div>
                        <h3>Easy Returns</h3>
                        <p>Hassle-free returns within 30 days with free pickup service</p>
                    </div>
                </div>

               
                <div className="contact-cta">
                    <h2>Still Have Questions?</h2>
                    <p>Our support team is here to help you</p>
                    <p>Call On 18000-200-500</p>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default CustomerSupport;