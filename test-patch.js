const axios = require('axios');

async function testPatchUserRequest() {
  try {
    const response = await axios.patch('http://localhost:3000/user/1', {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      subjects: [1, 2],
    });

    console.log('User updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
  }
}

async function testPatchSubjectRequest() {
  try {
    const response = await axios.patch('http://localhost:3000/subject/1', {
      name: 'Advanced Mathematics',
    });

    console.log('Subject updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating subject:', error.response ? error.response.data : error.message);
  }
}

(async () => {
  await testPatchUserRequest();
  await testPatchSubjectRequest();
})();