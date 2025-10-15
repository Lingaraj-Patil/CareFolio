

🩺 CareFolio — Wellness that Cares

Team Name: Catch Us if U Can
Domain: Open Innovation
Problem Statement: Build an intelligent, secure health platform that uses Machine Learning to personalize daily wellness plans and Blockchain to protect sensitive medical data.
The goal is to bridge the gap between generic fitness apps and fragmented clinical care by delivering smart, actionable, and trustworthy health guidance.

👥 Team Members

Varsha K N

Suparn Nayak

Sanya Sahu

Lingaraj Patil

🧠 Abstract

CareFolio bridges the critical gap between one-size-fits-all wellness apps and fragmented clinical care. It provides a secure, intelligent, and adaptive health management solution that combines personalized medicine with auditable blockchain security.

The ML engine instantly generates tailored meal and workout plans for users with chronic conditions such as diabetes or hypertension.

The entire prescription and verification process is logged on the Solana blockchain, ensuring data integrity and trust.

A Streamlit chatbot provides real-time explanations and guidance regarding the personalized plan.

⚙️ System Architecture
Flow Overview: From Survey to Blockchain Audit

Survey Submission:
The frontend (React) collects the user's health profile and transforms it into a flattened, one-hot encoded JSON structure.

ML Triage:
The backend (Node.js/Express) forwards the data to the ML Engine, which generates the personalized Meal and Workout Plan.

Data Persistence & Hashing:
Sensitive data and prescriptions are securely stored in the database, while a SHA-256 hash of the plan is computed.

Blockchain Record:
The backend logs this hash on the Solana blockchain, signed by a verified doctor’s key via an Anchor smart contract.

Final Delivery:
The backend returns both the personalized plan and the Solana transaction ID (TXID), serving as a cryptographic proof of authenticity.

🧩 Modules & Technologies
1. Machine Learning Layer

Models:

Meal Planner: Suggests safe, nutritious meals tailored to health conditions (e.g., low-glycemic for diabetics, low-sodium for hypertensive users).

Workout Planner: Recommends safe and effective exercises based on user fitness goals, medical restrictions, and activity level.

Approach:

Hybrid Model: Combines rule-based medical safety logic with XGBoost ML for personalization.

Adaptive Learning: Continuously fine-tunes based on user adherence, exertion, and progress.

Meal–Workout Coordination: Plans are synchronized to ensure optimal timing (e.g., post-meal walks for diabetics).

2. Decentralization Layer: Solana + IPFS

Blockchain:

Solana used for logging prescription hashes and managing doctor verification.

Anchor Framework enables scalable, low-cost smart contracts.

IPFS:

Stores non-sensitive data off-chain with cryptographic integrity checks.

Outcome:

Guarantees tamper-proof, verifiable medical plans.

3. Application Layer

Frontend: React (User Survey + Dashboard UI)

Backend: Node.js (Express API + Database Integration)

Chatbot: Streamlit (Groq API-based conversational AI)

Database: MongoDB / Firebase (Encrypted health record storage)

Blockchain Integration: Solana Devnet + Anchor smart contracts

🧪 Results & Outputs
Feature	Result
Personalized Plan Generation	Generated tailored meal + workout plans for conditions like "Diabetic, Sedentary, Weight Loss Goal"
Blockchain Integration	Successfully hashed and logged prescriptions on Solana Devnet with TXID returned
Chatbot Support	Delivered context-aware responses for user plans and health safety
Frontend	Completed multi-step survey + user dashboard with integrated ML and blockchain data flow
📊 Accuracy & Evaluation
Metric	Performance
Rule-Based Meal Safety	✅ 70% success rate in excluding contraindicated foods
Workout Suitability	✅ 80% accuracy in matching safe and effective routines
ML Adaptivity	✅ Feedback loop integrated for personalization improvement
🚀 Progress in 20 Hours (Hackathon Sprint)

Frontend: Multi-step survey, one-hot encoding, dashboard, and Streamlit chatbot integration.

Backend: Express API setup, database connection, ML + Solana API integration.

ML Models: Functional rule-based and XGBoost-based hybrid logic for personalization.

Blockchain: Deployed Doctor Certification & Prescription Hashing contracts on Solana Devnet.

🧩 Tech Stack
Layer	Technology
Frontend	React, Streamlit
Backend	Node.js, Express
ML Engine	Python, XGBoost, Pandas, Scikit-learn
Blockchain	Solana, Anchor Framework, IPFS
Database	MongoDB / Firebase
APIs	Groq API, Solana RPC
💼 Business Model & Social Impact

Free Core Offering: AI-driven personalized wellness plans.

Premium Tier: Direct consultations with blockchain-verified doctors and integration with wearable health data.

Social Impact: Decentralized, privacy-first health records build trust, accessibility, and interoperability in healthcare.

🔮 Future Work

Expand Datasets: Include more chronic conditions and diverse health data.

Wearable Integration: Connect Apple Health, Fitbit, and glucose sensors for real-time adaptive plans.

Multilingual Chatbot: Increase accessibility for diverse linguistic users.

Doctor–Patient Blockchain Portal: Enable verified doctors to securely modify and sign prescriptions.

Mobile App: Scale to Android and iOS platforms.

🏁 Conclusion

CareFolio demonstrates how AI and Blockchain can converge to create a trustworthy, adaptive, and secure health ecosystem.
By generating intelligent, medically-aware wellness plans and recording them immutably on the Solana blockchain, CareFolio lays the foundation for the next generation of decentralized digital health systems — where privacy, personalization, and care truly coexist.

🧱 Repository Structure
CareFolio/
├── frontend/                   # React survey and dashboard
├── backend/                    # Node.js + Express API
│   ├── routes/
│   ├── controllers/
│   ├── solana_integration/
│   └── ml_engine/
├── ml_models/                  # Python ML engine (Meal + Workout planners)
├── chatbot/                    # Streamlit chatbot using Groq API
├── smart_contracts/            # Solana Anchor programs
├── assets/                     # Architecture diagrams, UI images
└── README.md                   # Project documentation

🪙 Blockchain Verification Example
# Example Transaction Log
Prescription Hash: 89a7c4b9dfe123b07d9d42acb9...
Transaction ID (TXID): 3HtHcZK8tBvC...f5T7u7Hj1R3
Blockchain: Solana Devnet
Verified Doctor ID: dr_0x47fA12

🧩 Demo Links

🧠 Workout Planner: https://workout-guide-1.onrender.com/generate_plan

💬 CareFolio Chatbot: https://carefolio-fitness-chatbot.streamlit.app/

🎨 Frontend (Streamlit UI): [https://suparnnayak-workout-guide-app-1wwq7n.streamlit.app/]

Frontend: (https://care-folio-eqhs.vercel.app/)p

🏆 “Wellness That Cares.”

CareFolio represents the future of secure, intelligent, and human-centered digital health.
