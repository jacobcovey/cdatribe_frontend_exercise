import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

const LOGIN = gql`
  mutation ($c: AuthProviderCredentialsInput){
    loginUser(credentials: $c) {
      user {
        email
        roles {
          name
        }
      }
    }
  }
`;

const GET_USER = gql`
  query Self {
    viewer {
      self {
        email
        admin
        roles {
          name
        }
        organizations {
          name
        }
      }
    }
  }
`;

const LoginForm = () => {
  let email;
  let password;
  const [login, { data }] = useMutation(LOGIN);

  // const { loading, error, userData } = useQuery(GET_USER);

    return (
      <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                <form 
                  className="box" 
                  onSubmit={e => {
                    e.preventDefault();
                    debugger
                    login({ variables: { "c": {
                      "email": email.value,
                      "password": password.value
                      }}
                    });
                  }}
                >
                  <div className="field">
                    <label htmlFor="userName" className="label">Email</label>
                    <div className="control">
                      <input
                        type="email" 
                        ref={node => {
                          email = node;
                        }}
                        placeholder="user@gmail.com" 
                        className="input" 
                        required/>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="password" className="label">Password</label>
                    <div className="control">
                      <input 
                        type="password" 
                        ref={node => {
                          password = node;
                        }}
                        placeholder="*******" 
                        className="input" 
                        required/>
                    </div>
                  </div>
                  <div className="field">
                    <button className="button is-success">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  // }
}


export default LoginForm
