import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LoginRedirect() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/user/profile?token=${token}&login=qr`);
  }, [token, navigate]);

  return <div>Redirecting...</div>;
}
