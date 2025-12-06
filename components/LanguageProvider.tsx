"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "el";

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.terms": "Terms",
    "nav.contact": "Contact Us",
    "nav.book": "Book Now",
    "nav.language": "Language",

    "hero.title": "Rent Your Perfect Car in Greece",
    "hero.subtitle":
      "Explore the beauty of Greece with comfort and freedom. Choose from a wide range of vehicles at airports and ports across the islands.",

    "fleet.title": "Our Fleet",
    "fleet.empty": "No vehicles found in the database.",

    "search.pickupLocation": "Pick-up Location",
    "search.dropoffLocation": "Drop-off Location",
    "search.pickupDate": "Pick-up Date",
    "search.dropoffDate": "Drop-off Date",
    "search.pickupTime": "Pick-up Time",
    "search.dropoffTime": "Drop-off Time",
    "search.searchBtn": "Search",
    "search.differentDrop": "Different drop-off?",
    "search.selectLocation": "Select location",
    "search.selectDate": "Select date",
    "search.selectTime": "Select time",
    "search.toastPickLocation": "Select pick-up location",
    "search.toastPickDates": "Select dates",
    "search.toastSearching": "Searching cars...",
    "search.toastFound": "Cars found!",
    "search.toastError": "Error searching cars",
    "search.pickupTitle": "Select pick-up location",
    "search.dropoffTitle": "Select drop-off location",
    "search.pickupTimeTitle": "Pick-up time",
    "search.dropoffTimeTitle": "Drop-off time",
    "search.dateRangeTitle": "Select dates",

    "cars.noSearchTitle": "No search data found",
    "cars.noSearchSubtitle": "Start a new search to explore the available cars.",
    "cars.tripLabel": "Your trip",
    "cars.carsIn": "Cars in {{location}}",
    "cars.freeCancellation": "Free cancellation",
    "cars.instantConfirm": "Instant confirmation",
    "cars.supportBadge": "24/7 support",
    "cars.noCars": "No cars available for these dates. Try adjusting your search.",
    "cars.pickup": "Pick-up",
    "cars.dates": "Dates",
    "cars.duration": "Duration",
    "cars.orSimilar": "or similar {{type}}",
    "cars.availableForDates": "Available for your dates",
    "cars.fullInsurance": "Full insurance included",
    "cars.perk1": "Free additional driver",
    "cars.perk2": "Child seat on request",
    "cars.perk3": "No credit card fees",
    "cars.pricePerDay": "{{price}} / day · {{days}} days",
    "cars.viewDeal": "View deal",
    "cars.bestPrices": "Best prices already applied",

    "footer.explore": "Explore",
    "footer.locations": "Popular locations",
    "footer.support": "Need help?",
    "footer.description":
      "Reliable rentals across Crete with transparent pricing, fresh fleet, and 24/7 support wherever you land.",
    "footer.contact": "Contact",
    "footer.terms": "Terms",
    "footer.follow": "Follow us",
    "footer.book": "Book now",
    "footer.call": "Call us anytime for bookings, changes, or roadside assistance.",

    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Quick answers about booking, insurance, and pick-up.",
    "faq.q1": "What do I need to rent a car?",
    "faq.a1": "A valid driver’s license, ID/passport, and a credit/debit card. International permits may be required for non-EU licenses.",
    "faq.q2": "Can I pick up at the airport and drop off in the city?",
    "faq.a2": "Yes, one-way rentals between airports, ports, and city locations are available. Select different pick-up and drop-off when searching.",
    "faq.q3": "Is insurance included?",
    "faq.a3": "Full insurance is included in the displayed price. Extra options (e.g., glass/tyre cover) can be added during checkout.",
    "faq.q4": "What if my flight is delayed?",
    "faq.a4": "Share your flight number in the notes and our team monitors delays. We’ll adjust your pick-up time at no extra cost.",

    "about.title": "About Easy Rental - Parasiris",
    "about.subtitle":
      "We are a family-owned car rental company based in Greece, dedicated to offering reliable vehicles and personalized service for every journey.",
    "about.section1.title": "Our Mission & Values",
    "about.section1.p1":
      "Since our founding, Parasiris Car Rental has been committed to providing our customers with the freedom to explore Greece with comfort and confidence. Our fleet includes modern, fuel-efficient vehicles — from compact city cars to spacious SUVs.",
    "about.section1.p2":
      "Every vehicle is carefully maintained and inspected before each rental to ensure safety and quality. We take pride in our transparency, friendly service, and flexible rental options designed to fit every traveler’s needs.",
    "about.section2.title": "Why Choose Easy Rental - Parasiris?",
    "about.section2.card1.title": "Trusted Experience",
    "about.section2.card1.desc":
      "Over 15 years of experience serving travelers across Greece.",
    "about.section2.card2.title": "Flexible Rentals",
    "about.section2.card2.desc":
      "Daily, weekly, or long-term rentals tailored to your schedule.",
    "about.section2.card3.title": "24/7 Support",
    "about.section2.card3.desc":
      "Our team is always available to assist you — wherever you are.",

    "contact.title": "Contact Us",
    "contact.subtitle":
      "We are always at your service for bookings, inquiries, and special offers.",
    "contact.getInTouch": "Get in Touch",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.hours": "Opening Hours",
    "contact.hours.value": "Monday – Saturday: 08:00 – 21:00 · Sunday: 09:00 – 19:00",
    "contact.form.title": "Send us a Message",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.placeholder.name": "Your name",
    "contact.form.placeholder.email": "name@email.com",
    "contact.form.placeholder.message": "Write your message here...",
    "contact.form.submit": "Send",

    "terms.title": "Rental Terms & Conditions",
    "terms.subtitle":
      "Please read carefully the following terms before making a reservation or renting a vehicle from Easy Rental.",
    "terms.booking.title": "1. Booking Terms",
    "terms.booking.p1":
      "Reservations made through the website or by phone are confirmed via e-mail from Parasiris Car Rental. The confirmation constitutes a binding rental agreement.",
    "terms.booking.li1": "A valid credit or debit card is required to complete the booking.",
    "terms.booking.li2": "We do not guarantee a specific car model, only the vehicle group.",
    "terms.booking.li3": "The renter must collect the vehicle at the agreed location and time.",
    "terms.booking.li4": "Parasiris Car Rental reserves the right to refuse a booking without justification.",
    "terms.booking.li5": "Modifications or cancellations must be made at least 48 hours prior to the start of the rental period.",
    "terms.booking.p2": "In the event of a no-show, one rental day may be charged.",
    "terms.general.title": "2. General Rental Terms",
    "terms.general.li1": "The minimum driver age is 23 years for categories A–C and 25 years for higher categories.",
    "terms.general.li2": "The driver must hold a valid driver’s license for at least one year.",
    "terms.general.li3": "An ID card or passport and a credit card in the renter’s name are required.",
    "terms.general.li4": "Any modification to the rental agreement must be approved by Parasiris Car Rental.",
    "terms.general.li5": "The vehicle must be returned at the agreed time – otherwise a late return fee will apply.",
    "terms.general.li6": "Use of the vehicle outside Greece is prohibited without written authorization.",
    "terms.insurance.title": "Insurance & Damage Coverage",
    "terms.insurance.p1":
      "All rentals include basic third-party liability insurance. Additional coverage such as CDW (Collision Damage Waiver) or TP (Theft Protection) is available at an extra charge.",
    "terms.insurance.li1":
      "Insurance does not cover damage to tires, mirrors, the interior, undercarriage, or windshield.",
    "terms.insurance.li2":
      "The driver is responsible for any damage if driving under the influence of alcohol or drugs.",
    "terms.fuel.title": "Fuel & Cleanliness",
    "terms.fuel.p1":
      "Vehicles are delivered with a full tank and must be returned full. Returning the vehicle with less fuel will incur a refueling fee. In case of excessive dirt or odors (e.g., smoking), an additional cleaning charge applies.",
    "terms.local.title": "3. Local Rental Station Terms – Greece",
    "terms.local.li1": "The rental is governed by Greek law.",
    "terms.local.li2": "All vehicles have Greek license plates and insurance valid within the European Union.",
    "terms.local.li3":
      "Vehicle transportation to islands is permitted only with prior authorization from Parasiris Car Rental.",
    "terms.local.li4":
      "Drivers must comply with the Greek Highway Code and all traffic regulations.",
    "terms.local.li5":
      "In the event of an accident, the renter must immediately notify the police and the company.",
    "terms.local.li6":
      "All disputes are subject to the exclusive jurisdiction of the courts of Athens.",
    "terms.contact": "For any questions regarding these terms, please contact us at",

    "insurance.title": "Select Your Insurance",
    "insurance.subtitle": "Compare coverage options and choose what suits your trip.",
    "insurance.mostPopular": "Most Popular",
    "insurance.premium": "Premium Full Cover",
    "insurance.standard": "Standard Protection",
    "insurance.dailyPrice": "Daily Price:",
    "insurance.excess": "Excess Amount:",
    "insurance.noExcess": "No Excess (Full Cover)",
    "insurance.features.wind": "Windscreen Coverage",
    "insurance.features.theft": "Theft Protection",
    "insurance.features.roadside": "24/7 Roadside Assistance",
    "insurance.select": "Select this Plan",
    "insurance.loading": "Loading insurance plans...",
    "insurance.redirect": "Redirecting...",
    "insurance.goBack": "← Go Back",

    "checkout.title": "Complete Your Booking",
    "checkout.driver": "Driver Information",
    "checkout.address": "Address Details",
    "checkout.payment": "Payment",
    "checkout.paymentMethod": "Credit/Debit Card via Stripe",
    "checkout.payNow": "Pay Now",
    "checkout.processing": "Processing...",
    "checkout.required": "Please fill all required driver fields",
    "checkout.failed": "Failed to start payment.",
    "checkout.error": "Payment error",
    "checkout.loading": "Loading booking...",
    "checkout.inputs.name": "Full Name",
    "checkout.inputs.email": "Email Address",
    "checkout.inputs.phone": "Phone Number",
    "checkout.inputs.address": "Street Address",
    "checkout.inputs.city": "City",
    "checkout.inputs.country": "Country",
    "checkout.inputs.zip": "ZIP Code",
    "checkout.summary": "Booking Summary",
    "checkout.pickup": "Pick-up",
    "checkout.dropoff": "Drop-off",
    "checkout.carRental": "Car Rental:",
    "checkout.total": "Total:",

    "success.verifying": "Verifying payment...",
    "success.failed": "Payment verification failed.",
    "success.title": "Payment Successful!",
    "success.subtitle":
      "Thank you for your booking. Below you’ll find all confirmation details.",
    "success.carDetails": "Car Details",
    "success.bookingInfo": "Booking Information",
    "success.paymentDetails": "Payment Details",
    "success.paymentId": "Payment ID:",
    "success.status": "Status:",
    "success.amount": "Amount Paid:",
    "success.receipt": "View Stripe Receipt",
    "success.backHome": "Back to Home",

    "book.title": "Book your car in 3 steps",
    "book.subtitle": "Choose dates and location, pick your car, confirm. Simple and fast.",
    "book.step1.title": "Search with your dates",
    "book.step1.desc": "Select pick-up, drop-off, and times. We’ll show only available cars.",
    "book.step2.title": "Pick the perfect car",
    "book.step2.desc": "Compare prices, insurance, and perks. All taxes included upfront.",
    "book.step3.title": "Instant confirmation",
    "book.step3.desc": "Secure checkout with Stripe and get your voucher in seconds.",
    "book.support": "Need help? Call us anytime for a quick booking over the phone.",
  },
  el: {
    "nav.home": "Αρχική",
    "nav.about": "Σχετικά",
    "nav.terms": "Όροι",
    "nav.contact": "Επικοινωνία",
    "nav.book": "Κράτηση",
    "nav.language": "Γλώσσα",

    "hero.title": "Ενοικίασε το ιδανικό αυτοκίνητο στην Ελλάδα",
    "hero.subtitle":
      "Εξερεύνησε την ομορφιά της Ελλάδας με άνεση και ελευθερία. Διάλεξε ανάμεσα σε πολλά οχήματα σε αεροδρόμια και λιμάνια των νησιών.",

    "fleet.title": "Ο Στόλος μας",
    "fleet.empty": "Δεν βρέθηκαν οχήματα στη βάση.",

    "search.pickupLocation": "Σημείο παραλαβής",
    "search.dropoffLocation": "Σημείο επιστροφής",
    "search.pickupDate": "Ημερομηνία παραλαβής",
    "search.dropoffDate": "Ημερομηνία επιστροφής",
    "search.pickupTime": "Ώρα παραλαβής",
    "search.dropoffTime": "Ώρα επιστροφής",
    "search.searchBtn": "Αναζήτηση",
    "search.differentDrop": "Διαφορετική επιστροφή;",
    "search.selectLocation": "Επιλέξτε τοποθεσία",
    "search.selectDate": "Επιλέξτε ημερομηνία",
    "search.selectTime": "Επιλέξτε ώρα",
    "search.toastPickLocation": "Διάλεξε σημείο παραλαβής",
    "search.toastPickDates": "Διάλεξε ημερομηνίες",
    "search.toastSearching": "Αναζήτηση οχημάτων...",
    "search.toastFound": "Βρέθηκαν οχήματα!",
    "search.toastError": "Σφάλμα στην αναζήτηση",
    "search.pickupTitle": "Επιλογή σημείου παραλαβής",
    "search.dropoffTitle": "Επιλογή σημείου επιστροφής",
    "search.pickupTimeTitle": "Ώρα παραλαβής",
    "search.dropoffTimeTitle": "Ώρα επιστροφής",
    "search.dateRangeTitle": "Επιλογή ημερομηνιών",

    "cars.noSearchTitle": "Δεν βρέθηκαν δεδομένα αναζήτησης",
    "cars.noSearchSubtitle":
      "Ξεκίνησε μια νέα αναζήτηση για να δεις τα διαθέσιμα οχήματα.",
    "cars.tripLabel": "Το ταξίδι σου",
    "cars.carsIn": "Οχήματα σε {{location}}",
    "cars.freeCancellation": "Δωρεάν ακύρωση",
    "cars.instantConfirm": "Άμεση επιβεβαίωση",
    "cars.supportBadge": "Υποστήριξη 24/7",
    "cars.noCars":
      "Δεν υπάρχουν οχήματα για αυτές τις ημερομηνίες. Δοκίμασε άλλη αναζήτηση.",
    "cars.pickup": "Παραλαβή",
    "cars.dates": "Ημερομηνίες",
    "cars.duration": "Διάρκεια",
    "cars.orSimilar": "ή παρόμοιο {{type}}",
    "cars.availableForDates": "Διαθέσιμο για τις ημερομηνίες σου",
    "cars.fullInsurance": "Περιλαμβάνει πλήρη ασφάλεια",
    "cars.perk1": "Δωρεάν επιπλέον οδηγός",
    "cars.perk2": "Παιδικό κάθισμα κατόπιν αιτήματος",
    "cars.perk3": "Χωρίς χρέωση πιστωτικής",
    "cars.pricePerDay": "{{price}} / ημέρα · {{days}} ημέρες",
    "cars.viewDeal": "Δες την προσφορά",
    "cars.bestPrices": "Οι καλύτερες τιμές έχουν ήδη εφαρμοστεί",

    "footer.explore": "Εξερεύνηση",
    "footer.locations": "Δημοφιλείς τοποθεσίες",
    "footer.support": "Χρειάζεσαι βοήθεια;",
    "footer.description":
      "Αξιόπιστες ενοικιάσεις σε όλη την Κρήτη με διαφανείς τιμές, νέο στόλο και 24/7 υποστήριξη όπου κι αν φτάσεις.",
    "footer.contact": "Επικοινωνία",
    "footer.terms": "Όροι",
    "footer.follow": "Ακολούθησέ μας",
    "footer.book": "Κάνε κράτηση",
    "footer.call":
      "Κάλεσέ μας ανά πάσα στιγμή για κρατήσεις, αλλαγές ή οδική βοήθεια.",

    "faq.title": "Συχνές ερωτήσεις",
    "faq.subtitle": "Γρήγορες απαντήσεις για κράτηση, ασφάλεια και παραλαβή.",
    "faq.q1": "Τι χρειάζομαι για να νοικιάσω αυτοκίνητο;",
    "faq.a1": "Έγκυρο δίπλωμα, ταυτότητα/διαβατήριο και πιστωτική ή χρεωστική κάρτα. Για εκτός ΕΕ άδειες ίσως χρειάζεται διεθνές δίπλωμα.",
    "faq.q2": "Μπορώ να παραλάβω στο αεροδρόμιο και να επιστρέψω στην πόλη;",
    "faq.a2": "Ναι, υποστηρίζουμε μονή διαδρομή μεταξύ αεροδρομίων, λιμανιών και πόλης. Επίλεξε διαφορετική επιστροφή στην αναζήτηση.",
    "faq.q3": "Περιλαμβάνεται ασφάλεια;",
    "faq.a3": "Η πλήρης ασφάλεια περιλαμβάνεται στην τιμή. Πρόσθετες καλύψεις (π.χ. τζάμια/λάστιχα) μπορείς να προσθέσεις στο checkout.",
    "faq.q4": "Αν καθυστερήσει η πτήση μου;",
    "faq.a4": "Γράψε τον αριθμό πτήσης στις σημειώσεις και παρακολουθούμε τις καθυστερήσεις. Ρυθμίζουμε την παραλαβή χωρίς επιπλέον χρέωση.",

    "about.title": "Σχετικά με την Easy Rental - Parasiris",
    "about.subtitle":
      "Οικογενειακή εταιρεία ενοικίασης με έδρα την Ελλάδα, με αξιόπιστα οχήματα και προσωποποιημένη εξυπηρέτηση για κάθε ταξίδι.",
    "about.section1.title": "Η αποστολή και οι αξίες μας",
    "about.section1.p1":
      "Από την ίδρυσή μας, δεσμευόμαστε να προσφέρουμε ελευθερία εξερεύνησης με άνεση και σιγουριά. Ο στόλος μας περιλαμβάνει σύγχρονα, οικονομικά οχήματα — από μικρά πόλης μέχρι άνετα SUV.",
    "about.section1.p2":
      "Κάθε όχημα συντηρείται και ελέγχεται σχολαστικά πριν από κάθε ενοικίαση για ασφάλεια και ποιότητα. Υπερηφανευόμαστε για τη διαφάνεια, τη φιλική εξυπηρέτηση και τις ευέλικτες επιλογές που ταιριάζουν σε κάθε ταξιδιώτη.",
    "about.section2.title": "Γιατί Easy Rental - Parasiris;",
    "about.section2.card1.title": "Εμπειρία που εμπιστεύεσαι",
    "about.section2.card1.desc":
      "Πάνω από 15 χρόνια εξυπηρέτησης ταξιδιωτών σε όλη την Ελλάδα.",
    "about.section2.card2.title": "Ευελιξία ενοικίασης",
    "about.section2.card2.desc":
      "Ημερήσια, εβδομαδιαία ή μακροχρόνια ενοικίαση προσαρμοσμένη στο πρόγραμμά σου.",
    "about.section2.card3.title": "Υποστήριξη 24/7",
    "about.section2.card3.desc":
      "Η ομάδα μας είναι πάντα διαθέσιμη για βοήθεια — όπου κι αν βρίσκεσαι.",

    "contact.title": "Επικοινώνησε μαζί μας",
    "contact.subtitle":
      "Είμαστε πάντα στη διάθεσή σου για κρατήσεις, απορίες και ειδικές προσφορές.",
    "contact.getInTouch": "Επικοινωνία",
    "contact.phone": "Τηλέφωνο",
    "contact.email": "Email",
    "contact.address": "Διεύθυνση",
    "contact.hours": "Ώρες λειτουργίας",
    "contact.hours.value": "Δευτέρα – Σάββατο: 08:00 – 21:00 · Κυριακή: 09:00 – 19:00",
    "contact.form.title": "Στείλε μας μήνυμα",
    "contact.form.name": "Όνομα",
    "contact.form.email": "Email",
    "contact.form.message": "Μήνυμα",
    "contact.form.placeholder.name": "Το όνομά σου",
    "contact.form.placeholder.email": "name@email.com",
    "contact.form.placeholder.message": "Γράψε το μήνυμά σου...",
    "contact.form.submit": "Αποστολή",

    "terms.title": "Όροι & Προϋποθέσεις Ενοικίασης",
    "terms.subtitle":
      "Διάβασε προσεκτικά τους παρακάτω όρους πριν ολοκληρώσεις κράτηση ή ενοικίαση από την Easy Rental.",
    "terms.booking.title": "1. Όροι Κράτησης",
    "terms.booking.p1":
      "Κρατήσεις μέσω ιστοσελίδας ή τηλεφώνου επιβεβαιώνονται με e-mail από την Parasiris Car Rental. Η επιβεβαίωση αποτελεί δεσμευτική συμφωνία ενοικίασης.",
    "terms.booking.li1": "Απαιτείται έγκυρη πιστωτική/χρεωστική κάρτα για την ολοκλήρωση της κράτησης.",
    "terms.booking.li2": "Δεν εγγυόμαστε συγκεκριμένο μοντέλο, αλλά την κατηγορία οχήματος.",
    "terms.booking.li3": "Ο ενοικιαστής παραλαμβάνει το όχημα στον συμφωνημένο τόπο και χρόνο.",
    "terms.booking.li4": "Η Parasiris Car Rental διατηρεί το δικαίωμα άρνησης κράτησης χωρίς αιτιολόγηση.",
    "terms.booking.li5": "Αλλαγές/ακυρώσεις γίνονται έως 48 ώρες πριν την έναρξη της ενοικίασης.",
    "terms.booking.p2": "Σε no-show ενδέχεται να χρεωθεί μία ημέρα ενοικίασης.",
    "terms.general.title": "2. Γενικοί Όροι Ενοικίασης",
    "terms.general.li1": "Ελάχιστη ηλικία οδηγού 23 για κατηγορίες A–C και 25 για ανώτερες.",
    "terms.general.li2": "Το δίπλωμα πρέπει να είναι σε ισχύ τουλάχιστον 1 έτος.",
    "terms.general.li3": "Απαιτείται ταυτότητα/διαβατήριο και κάρτα στο όνομα του ενοικιαστή.",
    "terms.general.li4": "Κάθε τροποποίηση της σύμβασης εγκρίνεται από την Parasiris Car Rental.",
    "terms.general.li5": "Το όχημα επιστρέφεται στην ώρα του — αλλιώς ισχύουν χρεώσεις καθυστέρησης.",
    "terms.general.li6": "Απαγορεύεται η χρήση εκτός Ελλάδας χωρίς γραπτή άδεια.",
    "terms.insurance.title": "Ασφάλεια & Κάλυψη Ζημιών",
    "terms.insurance.p1":
      "Όλες οι ενοικιάσεις περιλαμβάνουν βασική αστική ευθύνη. Επιπλέον καλύψεις (CDW, TP) είναι διαθέσιμες με χρέωση.",
    "terms.insurance.li1":
      "Η ασφάλεια δεν καλύπτει ζημιές σε λάστιχα, καθρέφτες, εσωτερικό, κάτω μέρος ή παρμπρίζ.",
    "terms.insurance.li2":
      "Ο οδηγός ευθύνεται για ζημιές αν οδηγεί υπό την επήρεια αλκοόλ/ουσιών.",
    "terms.fuel.title": "Καύσιμα & Καθαριότητα",
    "terms.fuel.p1":
      "Τα οχήματα παραδίδονται γεμάτα και επιστρέφονται γεμάτα. Ελλιπές καύσιμο χρεώνεται. Υπέρμετρη βρωμιά/οσμές επιβαρύνονται με καθαρισμό.",
    "terms.local.title": "3. Τοπικοί Όροι Σταθμών – Ελλάδα",
    "terms.local.li1": "Η ενοικίαση διέπεται από το ελληνικό δίκαιο.",
    "terms.local.li2": "Όλα τα οχήματα έχουν ελληνικές πινακίδες και ασφάλεια εντός ΕΕ.",
    "terms.local.li3":
      "Μεταφορά σε νησιά επιτρέπεται μόνο με έγκριση της Parasiris Car Rental.",
    "terms.local.li4": "Τήρηση ΚΟΚ και όλων των κανονισμών κυκλοφορίας.",
    "terms.local.li5":
      "Σε ατύχημα ο ενοικιαστής ενημερώνει άμεσα αστυνομία και εταιρεία.",
    "terms.local.li6": "Κάθε διαφορά υπάγεται στα δικαστήρια Αθηνών.",
    "terms.contact": "Για ερωτήσεις σχετικά με τους όρους, επικοινώνησε στο",

    "insurance.title": "Επίλεξε την ασφάλειά σου",
    "insurance.subtitle":
      "Σύγκρινε τις καλύψεις και διάλεξε αυτή που ταιριάζει στο ταξίδι σου.",
    "insurance.mostPopular": "Πιο δημοφιλής",
    "insurance.premium": "Premium Πλήρης Κάλυψη",
    "insurance.standard": "Standard Προστασία",
    "insurance.dailyPrice": "Ημερήσια τιμή:",
    "insurance.excess": "Ποσό απαλλαγής:",
    "insurance.noExcess": "Χωρίς απαλλαγή (Full Cover)",
    "insurance.features.wind": "Κάλυψη παρμπρίζ",
    "insurance.features.theft": "Προστασία κλοπής",
    "insurance.features.roadside": "Οδική βοήθεια 24/7",
    "insurance.select": "Επίλεξε αυτό το πλάνο",
    "insurance.loading": "Φόρτωση ασφαλιστικών επιλογών...",
    "insurance.redirect": "Μεταφορά...",
    "insurance.goBack": "← Επιστροφή",

    "checkout.title": "Ολοκλήρωσε την κράτηση",
    "checkout.driver": "Στοιχεία οδηγού",
    "checkout.address": "Στοιχεία διεύθυνσης",
    "checkout.payment": "Πληρωμή",
    "checkout.paymentMethod": "Πιστωτική/Χρεωστική μέσω Stripe",
    "checkout.payNow": "Πλήρωσε τώρα",
    "checkout.processing": "Επεξεργασία...",
    "checkout.required": "Συμπλήρωσε τα απαραίτητα στοιχεία οδηγού",
    "checkout.failed": "Αποτυχία έναρξης πληρωμής.",
    "checkout.error": "Σφάλμα πληρωμής",
    "checkout.loading": "Φόρτωση κράτησης...",
    "checkout.inputs.name": "Ονοματεπώνυμο",
    "checkout.inputs.email": "Email",
    "checkout.inputs.phone": "Τηλέφωνο",
    "checkout.inputs.address": "Διεύθυνση",
    "checkout.inputs.city": "Πόλη",
    "checkout.inputs.country": "Χώρα",
    "checkout.inputs.zip": "ΤΚ",
    "checkout.summary": "Σύνοψη κράτησης",
    "checkout.pickup": "Παραλαβή",
    "checkout.dropoff": "Επιστροφή",
    "checkout.carRental": "Ενοικίαση αυτοκινήτου:",
    "checkout.total": "Σύνολο:",

    "success.verifying": "Έλεγχος πληρωμής...",
    "success.failed": "Η επιβεβαίωση πληρωμής απέτυχε.",
    "success.title": "Η πληρωμή ολοκληρώθηκε!",
    "success.subtitle":
      "Ευχαριστούμε για την κράτηση. Βλέπεις παρακάτω όλες τις λεπτομέρειες επιβεβαίωσης.",
    "success.carDetails": "Στοιχεία αυτοκινήτου",
    "success.bookingInfo": "Πληροφορίες κράτησης",
    "success.paymentDetails": "Στοιχεία πληρωμής",
    "success.paymentId": "Κωδικός πληρωμής:",
    "success.status": "Κατάσταση:",
    "success.amount": "Ποσό πληρωμής:",
    "success.receipt": "Δες την απόδειξη Stripe",
    "success.backHome": "Πίσω στην αρχική",

    "book.title": "Κάνε κράτηση σε 3 βήματα",
    "book.subtitle": "Διάλεξε ημερομηνίες και τοποθεσία, επέλεξε αυτοκίνητο, επιβεβαίωσε. Γρήγορα και απλά.",
    "book.step1.title": "Αναζήτησε με τις ημερομηνίες σου",
    "book.step1.desc": "Διάλεξε παραλαβή, επιστροφή και ώρες. Σου δείχνουμε μόνο διαθέσιμα αυτοκίνητα.",
    "book.step2.title": "Επέλεξε το ιδανικό αυτοκίνητο",
    "book.step2.desc": "Σύγκρινε τιμές, ασφάλεια και παροχές. Όλοι οι φόροι εμφανίζονται από την αρχή.",
    "book.step3.title": "Άμεση επιβεβαίωση",
    "book.step3.desc": "Ασφαλές checkout με Stripe και voucher σε δευτερόλεπτα.",
    "book.support": "Θέλεις βοήθεια; Κάλεσέ μας για άμεση κράτηση τηλεφωνικά.",
  },
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("lang") as Language | null)
        : null;
    if (stored === "el" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (value: Language) => setLangState(value);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const template = translations[lang]?.[key] ?? translations.en[key] ?? key;
    if (!vars) return template;
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replace(`{{${k}}}`, String(v)),
      template
    );
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslation() {
  return useLanguage().t;
}
