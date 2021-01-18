import React, { useCallback, useRef } from "react";

import { FiArrowLeft, FiLock, FiMail, FiUser } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Container, Content, AnimationContainer, Background } from "./styles";
import { Link, useHistory } from "react-router-dom";

import Button from "../../components/Button";
import Input from "../../components/Input";

import logoImg from "../../assets/logo.svg";
import getValidationErrors from "../../utils/getValidationErrors";
import api from "../../services/api";
import useToast from "../../hooks/ToastContext";

interface SubmitData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("E-mail inválido"),
          password: Yup.string().min(8, "Mínimo de 8 caracteres"),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post("/users", data);

        history.push("/");

        addToast({
          type: "success",
          title: "Cadastro realizado com sucesso!",
          description: "Você já pode fazer seu logon no GoBarber",
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao fazer cadastro",
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu cadastro</h1>

            <Input
              name="name"
              type="text"
              placeholder="Seu nome completo"
              icon={FiUser}
            />

            <Input
              name="email"
              type="text"
              placeholder="E-mail"
              icon={FiMail}
            />

            <Input
              name="password"
              type="password"
              placeholder="Senha"
              icon={FiLock}
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
