
interface User {
  email: string;
  password: string;
}

export const addUser = async (email: string, password: string) => {
  try {
    const postData: User = { email, password };
    const response: Response = await fetch('http://192.168.1.99:3006/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (response.ok) {
      const result: string = await response.text();
      console.log('API Antwort:', result);
      return 200;
    } else {
      console.error('Fehler bei der API-Anfrage:', response.status);
      return response.status; // 500 bei mehrfachem User
    }
  } catch (error) {
    console.error('Netzwerkfehler:', error);
    return 401;
  }
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    const response: Response = await fetch(`http://192.168.1.99:3006/getUserByEmail?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });

    if (response.ok) {
      const result = await response.json();
      console.log('API Antwort:', result);

      const user: User = {
        email: result.Username,
        password: result.Password
      };

      return user;
    } else {
      console.error('Fehler bei der API-Anfrage:', response.status);
      return undefined;
    }
  } catch (error) {
    console.error('Netzwerkfehler:', error);
    return undefined;
  }
};
