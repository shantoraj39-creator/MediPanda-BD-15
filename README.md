# MediPanda BD

A Foodpanda-style medicine delivery app for Bangladesh featuring AI-powered medicine suggestions, live pharmacist consultation, and prescription enhancement.

## Features

- **Role-based Access**: Separate views for Customers and Pharmacy Owners.
- **AI Assistant**: Powered by **Gemini 2.5 Flash** for medicine suggestions and price checks using **Google Search/Maps grounding**.
- **Live Pharmacist**: Real-time voice conversation using **Gemini 2.5 Native Audio (Live API)**.
- **Prescription Enhancer**: Edit, crop, and clean up prescription images using **Gemini 2.5 Flash Image**.
- **Medicine Calculator & Reminder**: Day-wise dosage calculator with alarms and smooth notifications.
- **Pharmacy Dashboard**: Inventory management, order tracking, and AI stock predictions.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React

## How to Connect to GitHub

To push this project to GitHub, follow these steps in your terminal:

1.  **Initialize Git**:
    ```bash
    git init
    ```

2.  **Add files**:
    ```bash
    git add .
    ```

3.  **Commit changes**:
    ```bash
    git commit -m "Initial commit: MediPanda BD app"
    ```

4.  **Create a Repository**:
    Go to [GitHub.com/new](https://github.com/new) and create a new empty repository.

5.  **Link Repository**:
    Replace `YOUR_USERNAME` and `REPO_NAME` with your actual details:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
    ```

6.  **Push Code**:
    ```bash
    git push -u origin main
    ```

## Environment Setup

Create a `.env` file in the root directory to store your API Key:

```
API_KEY=your_google_genai_api_key_here
```
