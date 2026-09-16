# 🎓 Student Exam Performance Indicator

### An End-to-End Machine Learning project — from raw data to a containerized model served on AWS ECS

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](http://student-performance-alb-1284440920.ap-south-1.elb.amazonaws.com/)
[![Python](https://img.shields.io/badge/Python-3.10-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-web%20app-black)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-containerized-2496ED)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20ECR%20%7C%20ALB-orange)](https://aws.amazon.com/ecs/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)](https://github.com/features/actions)

**🔗 Live Application:** [student-performance-alb-1284440920.ap-south-1.elb.amazonaws.com](http://student-performance-alb-1284440920.ap-south-1.elb.amazonaws.com/)

---

## 📌 Overview

This project predicts a student's **math exam score** from demographic and academic attributes (gender, ethnicity, parental education, lunch type, test preparation, and reading/writing scores). It's built as a **complete, production-style ML system** rather than a one-off notebook — covering data ingestion, transformation, model training/selection, a Flask web interface, containerization, and automated cloud deployment.

The goal of this project was to practice the full lifecycle a data/ML engineer owns in a real job: **modular pipeline code → reproducible training → packaged inference service → CI/CD → cloud infrastructure.**

## ✨ Key Features

- 🔁 **Modular ML pipeline** — ingestion, transformation, and training are independent, reusable components (not a single monolithic script)
- 🤖 **Multi-model training & selection** — trains and tunes 8 regression algorithms and automatically picks the best performer via `GridSearchCV`
- 🌐 **Flask web app** — a simple form-based UI where a user enters student attributes and gets a predicted math score in real time
- 🐳 **Dockerized** — the entire app is packaged into a single container image, served via Gunicorn
- ☁️ **Cloud-deployed on AWS** — running on **ECS Fargate**, fronted by an **Application Load Balancer**, with images stored in **ECR**
- ⚙️ **CI/CD with GitHub Actions** — every push to `main` automatically builds the Docker image, pushes it to ECR, and rolls out a new ECS deployment
- 📝 **Centralized logging & custom exception handling** for easier debugging in production
- 📊 **EDA & model experimentation notebooks** documenting the data analysis and model comparison process

## 🧠 Problem Statement

Given a student's:
- Gender
- Race/Ethnicity
- Parental level of education
- Lunch type (standard / free-reduced)
- Test preparation course status (completed / none)
- Reading score
- Writing score

...predict their **math score** using a trained regression model — helping identify students who may need extra academic support.

## 🏗️ Architecture

```
┌────────────┐     git push      ┌───────────────────┐
│  Developer │ ───────────────▶  │  GitHub Actions    │
└────────────┘                   │  (build & push)    │
                                  └─────────┬──────────┘
                                            │ docker push
                                            ▼
                                  ┌───────────────────┐
                                  │   Amazon ECR       │
                                  │ (image registry)   │
                                  └─────────┬──────────┘
                                            │ deploy
                                            ▼
┌────────────┐    HTTP request    ┌───────────────────┐
│    User    │ ─────────────────▶ │ Application Load   │
└────────────┘                    │ Balancer (ALB)      │
                                   └─────────┬──────────┘
                                             ▼
                                   ┌───────────────────┐
                                   │  ECS Fargate Task   │
                                   │  Flask + Gunicorn   │
                                   │  (Docker container) │
                                   └───────────────────┘
```

## 🔬 ML Pipeline

| Stage | Component | What it does |
|---|---|---|
| 1️⃣ Data Ingestion | `src/components/data_ingestion.py` | Reads the raw dataset, splits it into train/test sets, and persists them as artifacts |
| 2️⃣ Data Transformation | `src/components/data_transformation.py` | Builds a `ColumnTransformer` pipeline — median imputation + scaling for numerical features, most-frequent imputation + one-hot encoding for categorical features — and saves the fitted preprocessor |
| 3️⃣ Model Training | `src/components/model_trainer.py` | Trains and tunes 8 regressors (Linear Regression, Random Forest, Decision Tree, Gradient Boosting, AdaBoost, K-Neighbors, XGBoost, CatBoost) with `GridSearchCV`, evaluates each with R², and saves the best-performing model |
| 4️⃣ Prediction Pipeline | `src/pipeline/predict_pipeline.py` | Loads the saved preprocessor + model to transform new input and return a prediction |
| 5️⃣ Serving | `application.py` | Flask app exposing a form UI (`/`, `/predict`) that wraps the prediction pipeline |

Cross-cutting concerns — `src/exception.py` (custom exception with file/line context) and `src/logger.py` (timestamped file logging) — are used throughout every component for consistent error handling and traceability.

## 🛠️ Tech Stack

**Language & ML:** Python, scikit-learn, XGBoost, CatBoost, Pandas, NumPy
**Web Framework:** Flask, Gunicorn
**Containerization:** Docker
**Cloud & DevOps:** AWS ECS (Fargate), ECR, Application Load Balancer, GitHub Actions (OIDC-based auth to AWS)
**Tooling:** GridSearchCV for hyperparameter tuning, `dill`/`pickle` for artifact serialization

## 📂 Project Structure

```
End-To-End-ML-Project/
├── .github/workflows/aws.yml      # CI/CD pipeline (build → ECR → ECS deploy)
├── .aws/task-definition.json      # ECS Fargate task definition
├── artifacts/                     # Generated: train/test data, model.pkl, preprocessor.pkl
├── notebook/                      # EDA and model-training notebooks + raw dataset
├── src/
│   ├── components/
│   │   ├── data_ingestion.py
│   │   ├── data_transformation.py
│   │   └── model_trainer.py
│   ├── pipeline/
│   │   ├── train_pipeline.py
│   │   └── predict_pipeline.py
│   ├── exception.py
│   ├── logger.py
│   └── utils.py
├── templates/                     # HTML for the Flask web UI
├── application.py                 # Flask entry point
├── Dockerfile
└── requirements.txt
```

## 🚀 Getting Started

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/itskunalkumar/End-To-End-ML-Project.git
cd End-To-End-ML-Project

# 2. Create a virtual environment & install dependencies
python -m venv venv
source venv/bin/activate      # venv\Scripts\activate on Windows
pip install -r requirements.txt

# 3. Run the training pipeline (generates artifacts/model.pkl & preprocessor.pkl)
python src/components/data_ingestion.py

# 4. Start the Flask app
python application.py
```
The app will be available at `http://localhost:5000`.

### Run with Docker

```bash
docker build -t student-performance-app .
docker run -p 8000:8000 student-performance-app
```
Visit `http://localhost:8000`.

## ☁️ Deployment

This project ships with a full **CI/CD pipeline** (`.github/workflows/aws.yml`):

1. A push to `main` triggers the GitHub Actions workflow.
2. GitHub authenticates to AWS via OIDC (no long-lived secrets).
3. The workflow builds the Docker image and pushes it to **Amazon ECR**.
4. It renders a new **ECS task definition** with the freshly built image tag.
5. The task definition is deployed to an **ECS Fargate service**, which sits behind an **Application Load Balancer** — giving the app a stable public URL and zero-downtime rollouts.

## 📈 Future Improvements

- [ ] Add unit tests and a test stage to the CI pipeline
- [ ] Track experiments with MLflow
- [ ] Add a `/predict` REST/JSON API alongside the HTML form
- [ ] Add HTTPS via ACM + custom domain on the ALB
- [ ] Add model monitoring / drift detection

## 👤 Author

**Kunal Kumar**
Mechanical Engineering graduate transitioning into Data Analytics & ML Engineering
🔗 [GitHub](https://github.com/itskunalkumar)

---

⭐ If you found this project useful, consider giving it a star!
