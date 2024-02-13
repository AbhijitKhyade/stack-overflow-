# Stack Overflow Clone

This project is a StackOverflow clone with additional features including subscription plans, payment gateway integration, a reward system, multi-language support, and user login information tracking.

# Homepage

<img width="960" alt="Screenshot 2024-02-14 011204" src="https://github.com/AbhijitKhyade/stack-overflow-/assets/129264746/a6d19f0e-5569-417b-9e66-6b688f216962">

# AskQuestion

<img width="960" alt="Screenshot 2024-02-14 011441" src="https://github.com/AbhijitKhyade/stack-overflow-/assets/129264746/3eafbe2e-c55b-41c9-8704-5c44e1f81a35">

# Question Details

<img width="960" alt="Screenshot 2024-02-14 011911" src="https://github.com/AbhijitKhyade/stack-overflow-/assets/129264746/194b3d53-f8a7-4d8c-a920-52b256a1feec">

# User Profile

<img width="960" alt="Screenshot 2024-02-14 011605" src="https://github.com/AbhijitKhyade/stack-overflow-/assets/129264746/c33e3b57-7330-494a-a52e-960387572a73">

# Subscription with stripe payment-gateway

<img width="960" alt="Screenshot 2024-02-14 011527" src="https://github.com/AbhijitKhyade/stack-overflow-/assets/129264746/9d618327-acd4-4984-b37d-cd80b35282a5">

# Login History and Reward feature

<img width="960" alt="Screenshot 2024-02-14 011950" src="https://github.com/AbhijitKhyade/stack-overflow-/assets/129264746/d9161de6-16d5-4197-b682-9c43fc355188">

## Follow the below steps to run the project and its setup

Getting Started
**1. Clone the Repository**
Clone the project repository to your local machine using the command:

git clone https://github.com/your-username/stackoverflow-clone.git
cd stackoverflow-clone

**2. Install Dependencies**
Install project dependencies using:
npm install

**3. Environment Variables**
Create a .env file and configure the following variables:
DATABASE_URL=your_database_url
PORT=your_port

**4. Run the Application**
Start the application using:npm start

**5. Access the Application**
Open your browser and navigate to http://localhost:3000

## Project Features ##
1. CRUD Operation

Create:
Users can register and post questions.
Questions can have titles, descriptions, and tags.

Read:
Users can view questions and their answers.

Update:
Users can edit their own questions and answers.

Delete:
Users can delete their own questions and answers.

2. Subscription and Payment Gateway Integration
   
Subscription Plans:
Free Plan: 1 question/day.
Silver Plan: ₹1000/year, 20 questions/day.
Gold Plan: ₹3000/year, 50 questions.

Payment Gateway: Integrated with Stripe.

3. Reward System Point System:
Users earn points for various activities (e.g., posting questions, answering, receiving upvotes).

4. Multi-Language Support
Users have the option to change the language setting between languages such as English, French, Hindi and any more

5. User Login Information Tracking
Login History:
System captures information such as browser type, OS, system type, and IP address during user login.
Login history is stored in the database and displayed to the user.

