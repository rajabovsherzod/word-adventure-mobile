const axios = require("axios");

const getProgress = async () => {
  try {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NThmMjE0Y2UzZjYwYmE0NTA3NTc1YTkiLCJpYXQiOjE3MDY4NzEyNjksImV4cCI6MTcwOTQ2MzI2OX0.rXfPljLvfWpbJZvb0YICnSbM6_WnVL8YDfFsxMqBiC0";

    console.log("Sending request to http://localhost:5000/api/progress");

    const response = await axios.get("http://localhost:5000/api/progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response received:");
    console.log(JSON.stringify(response.data, null, 2));

    // Find lesson with id 1-1
    if (response.data && response.data.data) {
      const lesson = response.data.data.find(
        (lesson) => lesson.lessonId === "1-1"
      );
      if (lesson) {
        console.log("\nLesson 1-1 progress:");
        console.log(JSON.stringify(lesson, null, 2));
      } else {
        console.log("\nLesson 1-1 not found in progress data");
      }
    }
  } catch (error) {
    console.error("Error fetching progress:");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Response status: ${error.response.status}`);
      console.error("Response data:", error.response.data);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
    }
    console.error("Error config:", error.config);
  }
};

getProgress();
