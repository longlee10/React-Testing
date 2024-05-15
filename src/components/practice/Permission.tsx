export interface User {
  name: string;
  isAdmin?: boolean;
}

const Permission = ({ user }: { user: User }) => {
  return (
    <>
      <p>{user.name}</p>
      {user.isAdmin && <button>Delete User</button>}
      {user.isAdmin && <a href={`user/${user.name}`}> user</a>}
    </>
  );
};

export default Permission;
