export interface Dummy {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const dummyList: Dummy[] = [
  { id: 1, username: "user1", email: "user1@mail.com", password: "PassUser1" },
  { id: 2, username: "user2", email: "user2@mail.com", password: "PassUser2" },
  { id: 3, username: "user3", email: "user3@mail.com", password: "PassUser3" },
];
