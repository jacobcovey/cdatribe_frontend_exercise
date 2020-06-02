import React from 'react';
import gql from 'graphql-tag';
import { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [user, setUser] = useState(null);
  let email;
  let password;

  const client = new ApolloClient({
    uri: 'https://staging.selfdetermine.net/graphql',
  });

  const [login, { data }] = useMutation(LOGIN, {
    client: client,
    onCompleted(result) {
      getUser();
    },
    onError(err) {
      setLoading(false);
      setError(true);
      if (err.graphQLErrors && err.graphQLErrors.length && err.graphQLErrors.message) {
        setErrorText(err.graphQLErrors.message);
      } else {
        setErrorText("Login Error");
      }
    }
  });
  
  const [getUser, { userLoading, userData }] = useLazyQuery(GET_USER, {
    onCompleted(result) {
      setLoading(false);
      setUser(result.loginUser.user)
    },
    onError(result) {
      setLoading(false);
    }  
  });

    return (
      <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                {
                  error &&
                  <div className="notification is-danger has-text-centered">
                    <button className="delete" onClick={() => setError(false)}></button>        
                    {errorText} 
                  </div>
                }
                {
                  user &&
                  <div className="box" >
                    User Email: {user.email}
                    {user.roles.map((role) => (
                      <ul>{role.name}</ul>
                    ))}
                  </div>
                }
                {
                  !user &&
                  <form 
                    className="box" 
                    onSubmit={e => {
                      setLoading(true)
                      e.preventDefault();
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
                    <div className="field has-text-centered">
                      <button className={loading ? "button is-success is-loading" : "button is-success"}>
                        Login
                      </button>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  // }
}


export default LoginForm
