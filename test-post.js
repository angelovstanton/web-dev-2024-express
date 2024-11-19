const axios = require('axios');

async function testPostUniversityRequest() {
  try {
    const response = await axios.post('http://localhost:3000/university', {
      name: 'Sofia University',
      town: 'Sofia',
    });
    console.log('University created:', response.data);
    return response.data.id;
  } catch (error) {
    console.error('Error creating university:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function testPostSubjectRequest(subjectName) {
  try {
    const response = await axios.post('http://localhost:3000/subject', {
      name: subjectName,
    });
    console.log(`Subject '${subjectName}' created:`, response.data);
    return response.data.id;
  } catch (error) {
    console.error(`Error creating subject '${subjectName}':`, error.response ? error.response.data : error.message);
    throw error;
  }
}

async function testPostUserRequest(universityId, subjectIds) {
  try {
    const response = await axios.post('http://localhost:3000/user', {
      name: 'John Doe',
      email: 'johndoe@example.com',
      universityId,
      subjects: subjectIds,
    });
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response ? error.response.data : error.message);
  }
}

(async () => {
  try {
    const universityId = await testPostUniversityRequest();
    const mathSubjectId = await testPostSubjectRequest('Mathematics');
    const scienceSubjectId = await testPostSubjectRequest('Science');
    await testPostUserRequest(universityId, [mathSubjectId, scienceSubjectId]);
  } catch (error) {
    console.error('Test failed:', error.message);
  }
})();