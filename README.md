# 🎓 Intelearn : Interactive Learning Intelligent System

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow Lite](https://img.shields.io/badge/TensorFlow_Lite-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/lite)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

**Intelearn (Interactive Learning Intelligent System)** is an emotion-adaptive learning management system designed to provide a more personalized and engaging learning experience. It aims to identify students' emotional states during learning activities and adapt their learning experience through suitable interventions.

The project explores how emotion recognition and adaptive learning techniques can support students through appropriate learning resources, interactive activities, and encouragement.

---

## 🎯 Project Overview

Traditional learning management systems primarily deliver educational content without fully considering students' emotional states during the learning process.

Intelearn aims to address this challenge by combining learning management functionality with emotion-aware adaptation.

The system is designed to recognize selected emotional states and provide suitable learning interventions. For example, a student who appears frustrated may be offered a short interactive activity, while a student who appears sad may receive encouragement and an engaging learning activity.

The goal is to create a more responsive, supportive, and personalized learning environment.

## 🎯 Objectives

-  Develop a platform that supports personalized learning experiences.
-  Explore emotion recognition to understand students' learning states.
-  Adapt learning activities according to detected emotional states.
-  Provide interactive educational activities to encourage engagement.
-  Support lecturers in organizing and delivering learning materials.
-  Offer AI-assisted learning support through virtual learning mentors.
-  Improve the accessibility and usability of digital learning.

## ✨ Key Features

### 🧠 1. Emotion-Adaptive Learning

The system is designed to recognize the following emotional states:

- 😊 Happy
- 😢 Sad
- 😐 Neutral
- 😠 Frustrated

Based on the detected state, Intelearn can provide appropriate learning interventions.

### 🎮 2. Personalized Learning Interventions

- 🎯 Mini-games
- 🧩 Riddle quizzes
- 📚 Concept revision activities
- 💬 Encouraging messages
- 📖 Additional learning resources

These interventions aim to help students remain engaged with their learning activities.

### 📚 3. Learning Management

- 🔎 Course discovery and course information
- 📄 Learning-material access
- 🗂️ Educational content organization
- 📝 Quizzes and assignments
- 🔁 Learning-resource revision

### 👨‍🏫 4. Lecturer Features

- 📤 Learning-material management
- 📝 Quiz and assignment organization
- 📚 Learning-activity preparation
- 🎓 Digital learning support

### 🤖 5. AI Learning Mentors

**🧑‍💻 Dhruv** — Designed to assist with technical questions and learning-related explanations.

**🌟 Maya** — Designed to provide encouraging academic guidance, step-by-step explanations, and motivational support.

### 🔐 6. User Authentication

Authentication functionality helps protect learning features and supports access according to configured user roles.

### 🎯 7. Interactive Learning Activities

Interactive activities provide alternative ways for students to practise, review concepts, and engage with their learning.

---

## 🏗️ System Architecture

Intelearn follows a modular architecture consisting of the following conceptual components:

- 📱 **Frontend:** Mobile application and user interface.
- ⚙️ **Backend API:** Application logic, authentication, and communication.
- 🗃️ **Database:** Storage for application and learning data.
- 🧠 **Emotion Detection:** Recognition of selected emotional states.
- 🔄 **Adaptive Learning:** Selection of suitable learning interventions.
- 🤖 **AI Learning Mentors:** Additional learning assistance where integrated.

### 🗺️ Architecture Overview

```text
                  Intelearn Mobile App
                          |
                          v
                     Backend API
                          |
           +--------------+--------------+
           |              |              |
           v              v              v
        Database       Emotion        Learning
                      Detection      Management
                          |
                          v
                    Adaptive Learning
                     Interventions
```

*Note: This is a conceptual diagram. Update it to match the final implemented architecture.*

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| 📱 Frontend | React Native | Mobile application development |
| 💻 Programming | JavaScript | Application logic |
| ⚙️ Backend | Node.js | Server-side runtime |
| 🔌 API framework | Express.js | REST API development |
| 🔐 Authentication | JWT | Token-based authentication |
| 🧠 Emotion detection | Machine learning model | Emotion classification |
| 🎨 UI/UX design | Figma | Interface design and prototyping |
| 🌿 Version control | Git and GitHub | Source-code management |

*Include only the technologies actually used in your implementation.*

---

## 📂 Project Structure

The following is an example structure. Update it to match your repository.

```text
intelearn/
├── 📱 frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
│
├── ⚙️ backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── config/
│   ├── index.js
│   └── package.json
│
├── 🧠 emotion-detection/
│   ├── model/
│   ├── services/
│   └── README.md
│
├── 📚 docs/
├── .gitignore
└── README.md
```

---

## ⚙️ Project Setup and Installation

### 📋 Prerequisites

Install the required tools:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Expo Go](https://expo.dev/go), if the mobile application uses Expo
- Required database and machine-learning dependencies, if applicable

Verify your installations:

```bash
node --version
npm --version
git --version
```

### 📥 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd intelearn
```

Replace the placeholder with your actual GitHub repository URL.

### 📱 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

If the application uses Expo, start the development server:

```bash
npx expo start
```

Scan the displayed QR code with Expo Go or launch a supported emulator.

### ⚙️ 3. Install Backend Dependencies

Open a new terminal from the project root:

```bash
cd backend
npm install
```

Create the required `.env` file using the environment variables expected by your backend.

Example:

```env
PORT=5000
JWT_SECRET=your_secure_secret
DATABASE_URL=your_database_connection_string
```

Start the backend using the script configured in `package.json`. For example:

```bash
npm run dev
```

If the project has no `dev` script and uses `index.js` as its entry point, use:

```bash
node index.js
```

### 🧠 4. Configure Emotion Detection

If emotion detection runs as a separate Python service, follow its own setup instructions.

For a service that includes a `requirements.txt` file:

```bash
python -m venv .venv
```

Activate the virtual environment.

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the service using its actual entry point. Skip this step if emotion detection is already integrated into another application component.

### 🔗 5. Configure the API Connection

Configure the frontend to use the correct backend address.

- **Android emulator:** `http://10.0.2.2:5000`
- **Physical device:** `http://YOUR_COMPUTER_LAN_IP:5000`
- **Local web application:** `http://localhost:5000`

Use the appropriate address for your development environment and replace the port if necessary.

### ▶️ 6. Run the Application

Run each required component in a separate terminal:

| Component | Example command |
|---|---|
| 📱 Frontend | `npx expo start` |
| ⚙️ Backend | `npm run dev` |
| 🧠 Separate emotion service | Follow its setup instructions |

Start the backend and other required services before testing frontend features that depend on them.

### 🛠️ Troubleshooting

- 📦 **Dependency errors:** Check your Node.js version and run `npm install` in the correct directory.
- 🔗 **Connection errors:** Verify the backend is running and the API URL is correct.
- 🔐 **Authentication errors:** Check your environment variables and token configuration.
- 🗃️ **Database errors:** Verify the database is running and its connection settings are correct.
- 🧠 **Emotion-detection errors:** Check model files, dependencies, permissions, and service logs.

**Security note:** Never commit `.env` files, credentials, or private keys to GitHub.

*Setup commands are examples. Confirm the actual folder names, scripts, and environment variables against your repository.*

---

## 🔄 How It Works

1. 🔐 The student signs in to the application.
2. 🔎 The student searches for or selects a course.
3. 📚 The student accesses learning materials or assessments.
4. 🧠 Emotion detection evaluates supported input when appropriate.
5. 🏷️ The system classifies the detected emotional state.
6. 🎯 An appropriate learning intervention is selected.
7. 🚀 The student continues learning with the recommended activity.

---

## 🔐 Authentication and Authorization

A typical token-based authentication workflow includes:

1. 👤 The user submits login credentials.
2. ✅ The backend validates the credentials.
3. 🎟️ An authentication token is issued after successful authentication.
4. 🔒 The client handles the token securely.
5. 📡 Protected requests include the token.
6. 🛡️ The backend verifies the token and checks permissions.

### 🛡️ Security Considerations

- 🔑 Store passwords using secure password hashing.
- 🔒 Keep secrets in environment variables.
- 🚫 Exclude `.env` files from version control.
- ✅ Validate incoming requests.
- 👥 Apply role-based access control where required.
- 🌐 Use HTTPS in production.

---

## 🧠 Emotion Detection Workflow

### 🎭 Supported Emotional Categories

| Emotion | Icon | Possible Intervention |
|---|---|---|
| Happy | 😊 | Continue learning or offer a suitable next activity |
| Sad | 😢 | Encouragement or an engaging activity |
| Neutral | 😐 | Continue the regular learning experience |
| Frustrated | 😠 | Mini-game, riddle, or concept revision |

Emotion classification is an estimate and should not be treated as a definitive assessment of a student's feelings.

### 🔄 Workflow

```text
📚 Start Learning Activity
          |
          v
🔍 Check Detection Conditions
          |
          v
📷 Process Supported Input
          |
          v
🧠 Classify Emotional State
          |
          v
🎯 Select Learning Intervention
          |
          v
🎮 Present Recommended Activity
          |
          v
🚀 Continue Learning
```

### 🔏 Privacy and Responsible Use

- Inform users when emotion detection is active.
- Process information only for the intended purpose.
- Avoid unnecessary storage of facial data.
- Protect any retained results.
- Do not make high-impact academic decisions solely from emotion classification.

---

## 🔌 API Endpoints

The following are example REST API endpoints. Confirm them against the actual backend routes.

| Method | Example Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | 👤 Register a user |
| `POST` | `/api/auth/login` | 🔐 Authenticate a user |
| `GET` | `/api/courses` | 📚 Retrieve courses |
| `GET` | `/api/courses/:id` | 📖 Retrieve course details |
| `GET` | `/api/materials` | 📄 Retrieve learning materials |
| `GET` | `/api/quizzes` | 📝 Retrieve quizzes |
| `POST` | `/api/quizzes` | ➕ Create a quiz, if authorized |
| `GET` | `/api/assignments` | 📋 Retrieve assignments |
| `POST` | `/api/assignments` | ➕ Create an assignment, if authorized |
| `POST` | `/api/emotions/detect` | 🧠 Submit input for emotion detection, if implemented |

---

## 🗃️ Core Data Entities

| Entity | Purpose |
|---|---|
| 👤 User | Account and profile information |
| 🛡️ Role | User permissions |
| 📚 Course | Course information |
| 📄 Learning Material | Educational resources |
| 📝 Quiz | Quiz information |
| 📋 Assignment | Assignment information |
| 📤 Submission | Student submissions |
| 🧠 Emotion Result | Emotion-classification results, if retained |
| 🎯 Learning Intervention | Adaptive activity or recommendation |

The final entities and relationships should reflect the database schema used in the project.

---

## 🧪 Development and Testing

### 🔍 Development Stages

1. 📋 Requirement analysis
2. 🎨 UI/UX design
3. 📱 Frontend development
4. ⚙️ Backend development
5. 🧠 Emotion-detection integration
6. 🧪 Testing and evaluation
7. 🚀 Deployment and maintenance

### ✅ Testing Areas

- 🔐 Authentication and authorization
- 📚 Course and material access
- 📝 Quiz and assignment workflows
- 🧠 Emotion-detection behavior
- 🎯 Adaptive learning interventions
- 📱 Mobile application usability
- ⚡ API performance and application stability

---

## 📊 Evaluation

### 🧠 Emotion-Detection Evaluation

Possible evaluation metrics include:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix

Report actual results from your evaluation rather than estimated performance values.

### 👥 Usability Evaluation

Evaluate navigation, task completion, accessibility, and user feedback.

### ⚡ Performance Evaluation

Measure API response times, application stability, and emotion-detection performance under expected conditions.

---

## 🚀 Future Enhancements

- 🎯 More personalized learning recommendations
- 🎮 Additional interactive learning activities
- 🤖 Enhanced AI mentor capabilities
- 📊 Learning progress analytics
- 👨‍🏫 Improved lecturer dashboards
- ♿ Enhanced accessibility support
- 🧪 More comprehensive model evaluation
- 🔏 Improved privacy controls
- 🔗 Integration with existing learning management systems

---

## 👥 Project Information

| Item | Details |
|---|---|
| 🎓 Project Name | Intelearn |
| 📖 Full Name | Interactive Learning Intelligent System |
| 💡 Project Type | Emotion-Adaptive Learning Management System |
| 🏛️ University | Sabaragamuwa University of Sri Lanka |
| 🏫 Faculty | Faculty of Computing |
| 💻 Department | Department of Computing and Information Systems |
| 👥 Group | Group 19 |
| 🤝 Mentor | Vadivel Abishethvarman |
| 🧑‍🏫 Supervisor | Ms. A. W. T. Dulmini |

---

## 📄 License

This project was developed for academic purposes. Unless a separate license has been added to the repository, the code should not be assumed to be released under an open-source license.

If the project is intended for public distribution, add an appropriate `LICENSE` file and update this section accordingly.

---

<div align="center">

### 🎓 Intelearn

**Towards a more personalized and engaging learning experience.**

*Built with 💙 for smarter learning.*

</div>
