import React, { useCallback, useRef } from "react";

import { FiLogIn, FiMail, FiLock } from "react-icons/fi";

import { Container, Content, AnimationContainer, Background } from "./styles";

import { Form } from "@unform/web";
import * as Yup from "yup";
import { FormHandles } from "@unform/core";
import { Link, useHistory } from "react-router-dom";

import Button from "../../components/Button";
import Input from "../../components/Input";

import useAuth from "../../hooks/AuthContext";

import logoImg from "../../assets/logo.svg";

import getValidationErrors from "../../utils/getValidationErrors";
import useToast from "../../hooks/ToastContext";

interface SubmitData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { signIn } = useAuth();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("E-mail inválido"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(data, { abortEarly: false });

        const { email, password } = data;

        await signIn({ email, password });

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: "Ocorreu um erro ao fazer login, cheque as credenciais.",
        });
      }
    },
    [addToast, history, signIn]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu logon</h1>
            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              icon={FiMail}
            />

            <Input
              name="password"
              type="password"
              placeholder="Senha"
              icon={FiLock}
            />

            <Button type="submit">Entrar</Button>

            <Link to="/forgot">Esqueci minha senha</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
