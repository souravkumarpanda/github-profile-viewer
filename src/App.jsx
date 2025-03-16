import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { ImUnlocked } from "react-icons/im";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:user" element={<ProfileDetails />} />
        <Route path="/user/:user/repos" element={<Repos />} />
      </Routes>
    </>
  );
}
function ProfileDetails() {
  const [followers, setFollowers] = useState(null);
  const [following, setFollowings] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const { user } = useParams();
  async function getData() {
    const responce = await axios.get(`https://api.github.com/users/${user}`);
    // console.log(responce.data);
    setData(responce.data);
    getFollowing(responce.data.login);
    getFollowers(responce.data.followers_url);
  }
  function goBack() {
    navigate("/");
  }
  async function getFollowers(url) {
    const responce = await axios.get(`${url}`);
    setFollowers(responce.data);
  }
  async function getFollowing(login) {
    const url = `https://api.github.com/users/${login}/following`;

    const responce = await axios.get(`${url}`);
    setFollowings(responce.data);
  }
  useEffect(() => {
    getData();
  }, [user]);
  return (
    <div className="w-full text-white pt-2 h-screen overflow-auto bg-gray-800 flex flex-col justify-start items-center">
      <div>
        <button
          onClick={goBack}
          className="bg-white px-9 py-2 rounded-xl font-semibold text-gray-900"
        >
          Go Back
        </button>
      </div>
      <div className="flex w-full p-3 justify-around items-start">
        <div className="w-[200px] flex justify-center items-center pt-5">
          <img
            src={data && data.avatar_url}
            className="rounded-full border-4"
          />
        </div>
        <div className=" pt-2 gap-1 flex flex-col justify-start items-start w-[30%]">
          <h1 className="text-3xl text-blue-900 font-semibold">
            {data && data.name}
          </h1>
          <h1 className="text-md text-zinc-200 ">{data && data.login}</h1>
          <p className="text-gray-400 text-xs">{data && data.bio}</p>
          <div className="flex gap-5 p-2">
            <a
              className="px-6 bg-blue-800 py-2 rounded-lg "
              href={data && data.html_url}
              target="_blank"
            >
              Visit Profile
            </a>
            <Link
              to={`/user/${data && data.login}/repos`}
              className="px-6 bg-blue-800 py-2 rounded-lg "
            >
              See Repos
            </Link>
          </div>
          <h1>Company : {data && data.company}</h1>
          <h1>Blog : {data && data.blog}</h1>
          <p>Location: {data && data.location}</p>
        </div>
        <div className="flex flex-col justify-evenly items-center h-full">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-gray-400">Following</h1>
            <p className="text-2xl">{data && data.following}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-gray-400">Followers</h1>
            <p className="text-2xl">{data && data.followers}</p>
          </div>
        </div>
      </div>
      <div className="w-[90%] mb-7 flex gap-5 bg-gray-950 rounded-lg">
        <div className="w-[50%]   flex gap-2  flex-col   p-3">
          <h1 className="w-full text-3xl font-semibold text-center">
            Followers
          </h1>
          {Array.isArray(followers)
            ? followers.map((item, index) => {
                return (
                  <FollowCard
                    key={index}
                    name={item.login}
                    avatar_url={item.avatar_url}
                    login={item.login}
                    html_url={item.html_url}
                  />
                );
              })
            : "Empty"}
        </div>
        <div className="w-[50%]   flex gap-2  flex-col   p-3">
          <h1 className="w-full text-3xl font-semibold text-center">
            Following
          </h1>
          {Array.isArray(following)
            ? following.map((item, index) => {
                return (
                  <FollowCard
                    key={index}
                    name={item.login}
                    avatar_url={item.avatar_url}
                    login={item.login}
                    html_url={item.html_url}
                  />
                );
              })
            : "Empty"}
        </div>
      </div>
    </div>
  );
}

function Repos() {
  const { user } = useParams();
  const [repos, setRepos] = useState();
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }
  async function getRepos() {
    const responce = await axios.get(
      `https://api.github.com/users/${user}/repos`
    );

    setRepos(responce.data);
  }
  useEffect(() => {
    getRepos();

    // console.log(repos[1].private);
  }, [user]);
  return (
    <div className="w-full text-white pt-2 gap-5 h-screen overflow-auto bg-gray-800 flex flex-col justify-start items-center">
      <div>
        <button
          onClick={goBack}
          className="bg-white px-9 py-2 rounded-xl font-semibold text-gray-900"
        >
          Go Back
        </button>
      </div>
      <div className="w-full flex justify-center ">
        <div className="max-w-[90%] mb-7 flex gap-5 flex-wrap justify-center items-start bg-gray-950 rounded-lg py-4 px-2 ">
          {Array.isArray(repos) ? (
            repos.map((repo, index) => (
              <RepoCard
                key={index}
                name={repo.name}
                privatee={repo.private}
                login={user}
                avatar_url={repo.owner.avatar_url}
                html_url={repo.owner.html_url}
              />
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="">
      <div className="m-10 w-[50px] h-[50px] border-2 rounded-full animate-spin border-x-transparent"></div>
    </div>
  );
}
function RepoCard({ name, login, avatar_url, privatee, html_url }) {
  const url = html_url + "/" + name;
  return (
    <>
      <a
        href={url}
        target="_blank"
        className="w-[200px] h-[200px] flex flex-col justify-between px-2 py-1 items-center rounded-lg  border-2 border-purple-950 cursor-pointer"
      >
        <div className=" h-full flex justify-center items-center text-xl w-full overflow-auto mb-4">
          <h1 className="w-full text-center">{name}</h1>
        </div>
        <div className="h-[25px] w-full flex justify-start gap-4 px-6 items-center ">
          <img src={avatar_url} className="h-full rounded-full" />
          <h1 className=" text-xs text-gray-400"> {login}</h1>
          <div>{privatee ? <FaLock /> : <ImUnlocked />}</div>
        </div>
      </a>
    </>
  );
}
function FollowCard({ avatar_url, name, login, html_url }) {
  // console.log(name);
  return (
    <Link
      to={`/user/${login}`}
      className="w-full flex justify-around gap-6 items-center rounded-md border-2 text-white border-purple-950 p-2"
    >
      <div className="w-[40px]  rounded-2xl overflow-hidden">
        <img src={avatar_url} className="w-full" />
      </div>
      <h1>{name}</h1>
      <a href={html_url} className="bg-purple-900 px-5 py-1 rounded-md">
        Visit On Github
      </a>
    </Link>
  );
}
function Home() {
  const [user, setUser] = useState({});
  const inputRef = useRef();
  async function submitHandle() {
    const name = inputRef.current.value;
    // console.log(name);
    const responce = await axios.get(`https://api.github.com/users/${name}`);
    // console.log(responce.data);
    setUser(responce.data);
  }
  return (
    <>
      <div className="w-full h-screen bg-gray-800">
        <h1 className="w-full py-5 text-gray-100 text-4xl text-center bg-gray-900">
          Github Profile Viewer
        </h1>
        <InputComp inputRef={inputRef} submitHandle={submitHandle} />
        <div className="flex justify-center items-center mt-9">
          {user && typeof user == "object" ? (
            <OutPutCard user={user} />
          ) : (
            "Empty"
          )}
        </div>
      </div>
    </>
  );
}

function InputComp({ inputRef, submitHandle }) {
  return (
    <div className="w-full mt-5 flex justify-center gap-4 items-center flex-col">
      <input
        // value={"Devangkartik"}
        type="text"
        placeholder=" Enter your Github user name"
        ref={inputRef}
        className="py-2 px-10 rounded-lg w-6/12 outline-none"
      />
      <button
        onClick={submitHandle}
        className="py-2 px-10 text-white bg-blue-800 rounded-lg w-6/12"
      >
        Submit
      </button>
    </div>
  );
}
function OutPutCard({ user }) {
  return (
    <Link
      to={user.login ? `/user/${user.login}` : "/"}
      className="w-[500px] h-[200px] p-5 flex  justify-around gap-10 bg-blue-50 rounded-lg"
    >
      <img src={user.avatar_url} className=" " />
      <div className="flex flex-col justify-start gap-5 items-center">
        <h1 className="text-md font-semibold ">{user.name}</h1>
        <p className="text-sm text-gray-600">{user.login}</p>
        <p className="text-xs text-gray-800 w-52 text-center">{user.bio}</p>
      </div>
    </Link>
  );
}

export default App;
