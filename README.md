
# Stack Overflow Clone

This project is a StackOverflow clone with additional features including subscription plans, payment gateway integration, a reward system, multi-language support, and user login information tracking.

Getting Started
1. Clone the Repository
Clone the project repository to your local machine using the command:

git clone https://github.com/your-username/stackoverflow-clone.git
cd stackoverflow-clone

2. Install Dependencies
Install project dependencies using:
npm install

3. Environment Variables
Create a .env file and configure the following variables:
DATABASE_URL=your_database_url
PORT=your_port

4. Run the Application
Start the application using:npm start

5. Access the Application
Open your browser and navigate to http://localhost:3000

Project Features
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

Payment Gateway:

Integrated with Stripe.

3. Reward System Point System:

Users earn points for various activities (e.g., posting questions, answering, receiving upvotes).

4. Multi-Language Support
Users have the option to change the language setting between languages such as English, French, Hindi and any more

5. User Login Information Tracking
Login History:
System captures information such as browser type, OS, system type, and IP address during user login.
Login history is stored in the database and displayed to the user.

