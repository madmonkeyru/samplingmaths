# **PROJECT MEP-EA-01: SYSTEM TECHNICAL SPECIFICATION & FRAMEWORK MATRIX**

## **1\. Project Metadata & Architecture**

* **Project Identifier:** MEP-EA-01  
* **Lifecycle Status:** Draft  
* **Document Classification:** Comprehensive Overview, Comparison & Matrix  
* **Target Domain:** *Educación Abierta* Framework (Ministerio de Educación Pública, Costa Rica)  
* **Project Architecture:** B2C privately owned and funded project  
* **System Integration Status:** Non-integrated; operates independently without dependency on MEP databases or live services

## **2\. Program Taxonomy & Scope Specifications**

The *Educación Abierta* framework comprises four distinct open-access educational programs targeted at specific academic levels and population segments.

* **I\&II CICLO:** Covers primary education (grades 1–6 through 5 tests) via the *Primaria por Suficiencia*.  
* **III CICLO:** Covers lower secondary education (grades 7–9) for learners who have completed primary education.  
* **EDAD (Bachillerato de Educación Diversificada a Distancia):** Distance-education upper secondary route (grades 10–11) leading to the *Bachiller en Educación Media*.  
* **BXM (Bachillerato por Madurez Suficiente):** Open-system upper secondary route to the *Bachiller en Educación Media* title for adult learners.

## **3\. Program Parameters & Evaluation Specifications**

### **3.1 Technical Matrix by Program**

| Dimension | I\&II CICLO | III CICLO | EDAD | BXM |
| :---- | :---- | :---- | :---- | :---- |
| **Educational Level** | Primary (grades 1–6) | Lower secondary (grades 7–9) | Upper secondary (grades 10–11) | Upper secondary (Bachillerato) |
| **Minimum Age** | 14 years | 14 years (general guideline) | \>16 years (limit removed in 2024\) | 18 years (exceptions apply for adolescent parents) |
| **Prerequisites** | Basic literacy and numeracy in Spanish | Approved I & II Ciclos (Primary) | Approved III Ciclo (9° año) | Approved III Ciclo (9° año) |
| **Evaluated Subjects** | Ciencias, Español, Formación Ciudadana, Matemática, Estudios Sociales | Matemática, Ciencias, Estudios Sociales, Español, Idioma Extranjero, Formación Ciudadana | Ciencias Pick(Biología/Física/Química), Español, Educación Cívica, Idioma, Matemáticas, Estudios Sociales | Ciencias Pick(Biología/Física/Química), Español, Educación Cívica, Idioma, Matemáticas, Estudios Sociales |
| **Test Structure** | 1 test per subject per convocatoria | 1 test per subject per level (e.g Maths 7th, 8th, 9th) | 2 tests per subject (Parte 1: 10°, Parte 2: 11°) | 1 test per subject per convocatoria |
| **Passing Score** | 65 (Standard EGBA) | 65 | 70 | 70 |
| **Test Fee** | ₡8,000 per test | ₡8,000 per test | ₡8,000 per test | ₡8,000 per test |
| **Delivery Mode** | Open / flexible | Open / flexible | Distance (with ICER support optionally) | Open / self-directed |

### **3.2 Program-Specific Constraints & Rules**

* **I\&II CICLO Constraints:** Calculators are strictly prohibited for the mathematics test. Candidates arriving more than 30 minutes late are barred from entry. No prior formal-education subject recognition mechanism is detailed; learners must complete all 5 monolithic tests.  
* **III CICLO Constraints:** Students must pass all six subjects across all three academic levels. Recognizes levels passed in the **formal education** format.   
* **EDAD Constraints:** Assesses each subject via two separate testing modules covering tenth and eleventh-grade curricula. Passing **Part 1** is a pre-requisite to enroll in **Part 2\. Also recognizes 10th level subjects passed in formal education format.**   
* **BXM Constraints:** Permitted examination materials include black or blue ink pens, white correction fluid, non-programmable calculators, graphite pencils, sharpeners, and erasers.

## **4\. Prior Recognition & Equivalency Protocols**

* **General Framework:** Recognition is non-automatic and requires formal application, supporting documentation, and MEP verification. Per *Decreto Ejecutivo N° 40862-MEP*, Educación Abierta assessments are equiparable with formal diversified education FARO tests.  
* **I\&II CICLO Recognition Protocol:** Does not recognise  levels passed in **formal education (primary education). Students must pass all 5 tests to certify.**  
* **III CICLO Recognition Protocol:** Supports formal school credits (public/private), IPEC/CINDEA modules, and foreign studies verified via DGEC resolution. Requires a formal request form, identification, and certified grade breakdowns signed by the school director.  
* **EDAD Recognition Protocol:** Permits formal-education credit mapping for approved 10th and 11th-grade subjects using dedicated documentation.  
* **BXM Recognition Protocol:** Utilizes a unified BXM/EDAD recognition form to map formal education subjects (Idioma, Biología, Física, Química, Matemáticas, Estudios Sociales, Español, Educación Cívica). Requires noveno-year certification authenticated by school and regional directors. Recognizes subjects passed in the EDAD program as long as both **Part 1 & 2 are passed.**

## **5\. Strategic System Constraints for Project MEP-EA-01**

* **Content Alignment:** Preparation curricula must match distinct evaluation topologies (e.g., EDAD's dual-test model vs. BXM's single-test model).  
* **Schedule Tracking:** Platform must account for multiple asynchronous convocatorias per year with independent registration and testing windows.  
* **Documentation Support:** High documentation complexity necessitates built-in user guides and checklists for prior recognition workflows.  
* **Decoupled Data Architecture:** Due to the absence of API-level MEP database access, all user tracking, registration logging, and recognition states must be managed via manual user input.