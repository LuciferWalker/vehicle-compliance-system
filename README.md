# Vehicle Compliance System 🚗

## Overview

The Vehicle Compliance System is a **cloud-based application** designed to streamline vehicle compliance checks by leveraging **AWS Rekognition** for OCR-powered text extraction and **PostgreSQL** for compliance data storage. The system enables users to upload vehicle images and instantly retrieve their insurance and registration compliance status, reducing manual intervention by **40%**. 

This project employs a **multi-region configuration** to handle diverse license plate formats across different regions, making it extensible and globally adaptable.

---

## Tech Stack 🛠️

- **Frontend**: [Next.js](https://nextjs.org/)  
  A React-based framework used for creating server-rendered, highly performant web applications.

- **Backend**: [Node.js](https://nodejs.org/en/) with [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)  
  API endpoints built to interact with OCR and compliance data.

- **Database**: [PostgreSQL (RDS)](https://aws.amazon.com/rds/)  
  A managed database service on AWS for storing vehicle and compliance data efficiently.

- **Cloud Services**:  
  - **AWS S3**: For storing uploaded vehicle images.  
  - **AWS Rekognition**: For performing OCR to extract license plate numbers.  
  - **AWS Elastic Beanstalk**: For deploying the backend seamlessly.  

- **Containerization & CI/CD**:  
  - **Docker**: Used for containerizing the application to ensure consistency across environments.  
  - **GitHub Actions**: CI/CD pipelines implemented for automated testing and deployment.

---

## Features 🚀

### 1. **Image Upload**  
   Users can upload vehicle images, which are securely stored in AWS S3 for further processing.

### 2. **OCR-Powered License Plate Extraction**  
   - OCR functionality is powered by AWS Rekognition to extract license plate numbers from uploaded images.  
   - Multi-region support for handling diverse license plate formats (e.g., Ontario, British Columbia).  

### 3. **Compliance Check**  
   - License plate numbers are checked against a PostgreSQL database to retrieve compliance details such as insurance and registration status.

### 4. **Multi-Region Support**  
   - The application includes region-specific configurations, allowing the system to adapt to license plate formats across regions like **Canada (Ontario, British Columbia)** and **India (Karnataka, Maharashtra)**.

### 5. **Secure & Scalable Deployment**  
   - The backend is deployed on **Elastic Beanstalk**, with services containerized using **Docker** for scalability.  
   - CI/CD pipelines implemented via **GitHub Actions** for automated testing and streamlined deployment.

---

## Lifecycle: From Inception to Deployment 📈

### 1. **Idea Conceptualization**  
   - The project began as an effort to showcase modern, cloud-based solutions for automating vehicle compliance checks.  
   - Focused on solving manual errors and inefficiencies in vehicle registration verification.

### 2. **Development Stages**  
   - **API Development**: Developed modular APIs for image upload, OCR processing, and compliance retrieval.  
   - **OCR Logic Improvements**: Iteratively refined OCR capabilities using regex-based filters for multi-region license plates.  
   - **Database Design**: Created efficient schemas for storing vehicle data and compliance statuses in PostgreSQL.

### 3. **Challenges & Decisions**  
   - **OCR Accuracy**: AWS Rekognition's default OCR faced challenges with non-standard license plate images. Custom filtering and multi-region regex support were added to improve accuracy.  
   - **Multi-Region Design**: Introduced a flexible configuration file to allow easy addition of new regions and their respective license plate formats.  
   - **Tech Choices**: Chose Elastic Beanstalk over EC2 for its ease of deployment and scalability.  

### 4. **Deployment**  
   - Application was containerized using Docker and deployed on Elastic Beanstalk.  
   - GitHub Actions CI/CD pipelines ensured automated testing and fast deployment cycles.

---

## How to Use 🛠️

1. **Upload an Image**  
   Upload a clear photo of the vehicle's license plate through the frontend interface.  

2. **Get Compliance Status**  
   The system processes the image, extracts the license plate, and retrieves compliance information from the database.  

---

## Key Decisions Made Along the Way 💡

1. **Multi-Region Configurations**:  
   Designed a country-state-based configuration structure for license plate regex and noise filtering.  

2. **AWS Rekognition for OCR**:  
   While exploring other OCR services, Rekognition was chosen for its seamless integration with S3.  

3. **Modular API Design**:  
   Separated image upload, OCR, and compliance logic into standalone APIs for better maintainability.  

4. **Scalable Deployment**:  
   Elastic Beanstalk was chosen for deployment due to its managed environment and out-of-the-box scalability features.  

---

## Future Enhancements 🔮

1. **Improved OCR Accuracy**  
   - Explore AWS Textract or fine-tune Rekognition with a custom-trained model for better plate recognition.  

2. **Authentication**  
   - Implement secure authentication for users to track compliance history.  

3. **Real-Time Notifications**  
   - Add push notifications for compliance reminders or registration expiry alerts.  

4. **Global Expansion**  
   - Extend support for additional countries and states with diverse license plate formats.  

---

## Tech Used 💻

| **Technology**         | **Purpose**                                   |
|-------------------------|-----------------------------------------------|
| Next.js                | Frontend and API backend framework            |
| AWS S3                 | Image storage                                 |
| AWS Rekognition        | OCR for license plate recognition             |
| PostgreSQL (RDS)       | Database for vehicle and compliance data      |
| Elastic Beanstalk      | Backend deployment                            |
| Docker                 | Containerization                              |
| GitHub Actions         | CI/CD pipelines for testing and deployment    |

---

Feel free to contribute to the repository or raise issues for enhancements!