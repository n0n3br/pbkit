# pbkit

A set of svelte components to facilitate the integration between your app and pocketbase

## Installation

Using pnpm (recomended)

```bash
pnpm i @n0n3br/pocketkit pocketbase
```

, npm

```bash
npm i @n0n3br/pocketkit pocketbase
```

or yarn

```bash
yarn add @n0n3br/pocketkit pocketbase
```

## Components

### PbApp

Initializes the pocketbase instance so you can use it in other components. To use this component you must provide the pocketbase address.

```svelte
<script>
	import { PbApp } from '@n0n3br/pbkit';
</script>

<PbApp url="http://127.0.0.1:8090" let:pb />
```

### PbUser

Provides info about the current user and methods to sign in (email and password) or sign up (name, email, password and password confirmation) and to sign out. It must the receive the pocketbase instance provided by PbApp to work. It has 2 slots:

- default : provides user info and sing out method
- signedOut: provides sign in and sign up methods to be used in your form. This slot already has a basic form provided

The transition between the default slot (user is authenticated) and the signedOut one is alreadt handled by the component.

```svelte
    <script>
        import { PbApp, PbUser } from '@n0n3br/pbkit'
    </script>
    <PbApp url='http://127.0.0.1:8090' let:pb>
        <PbUser {pb} let:user let:signOut/>
            <nav>
                <span>Hello {user?.name}</span>
                <button on:click={signOut()}>Sign Out</button>
            </nav>
            <!-- optional auth form -->
            <div slot="signedOut" let:signIn let:signUp>
                <form
                    on:submit={isSignIn
                        ? signIn(email, password)
                        : signUp(name, email, password, passwordConfirm)}
                >
                    {#if !isSignIn}
                        <input type="text" placeholder="Name" minlength="5" required />
                    {/if}
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required minlength="6" />
                    {#if !isSignIn}
                        <input type="password" placeholder="Password confirm" minlength="6" required />
                    {/if}
                    <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
                    <a href="/" on:click={modeChangeHandler}>{isSignIn ? 'Create account' : 'Sign In'}</a>
                </form>
            </div>
        </PbUser>
    </PbApp>
```

### PbCollection

Provides an array of documents from a collection based on its name. As in PbUser you need to passs the pocketbase instance provided by PbApp. There's also the option to provide a filter and sort order. Besides the data retrieved, there are methods for updating (id and data object), creating (data object) and removing (id) documents.

```svelte
    <script>
        import { PbApp, PbUser, PbCollection } from '@n0n3br/pbkit'
        let description:string
    </script>

    <PbApp url='http://127.0.0.1:8090' let:pb>
        <PbUser {pb} let:user />
            <!-- filter only user's todos
            and sort by created desc -->
            <PbCollection
                {pb}
                name="todos"
                let:data
                filter={`user='${user?.id}'`}
                sort="-created"
                let:update
                let:remove
                let:create
            >
                <form on:submit={ () => {
                    create({ description, done: false, user: user?.id });
                    description = ""
                }}>
                    <input type="text" bind:value={description} placeholder="New Todo" minlength="6" />
                    <button type="submit">Create</button>
                </form>
                <ul>
                {#each data ?? [] as todo}
                    <li>
                        <button on:click={ remove(todo.id) }>Delete</button>
                        <button on:click={ update(todo.id, { done: !todo.done }) }>Toggle</button>
                        { todo.description }
                    </li>
                {/each}

                </ul>

            <PbCollection>
        </PbUser>
    </PbApp>
```

### PbDocument

Provides one single document based on the collection name and the id of the document. As in PbUser you need to passs the pocketbase instance provided by PbApp.

```svelte
    <script>
        import { PbApp, PbUser, PbDocument } from '@n0n3br/pbkit'
        const taskCollection = 'tasks'
        const fakeId = 'a1r564e'
    </script>

    <PbApp url='http://127.0.0.1:8090' let:pb>
        <PbUser {pb} let:user let:signOut/>
            <PbDocument collection={tasksCollection} id={fakeId} {pb} let:document>
                { document?.description }
            </PbDocument>
        </PbUser>
    </PbApp>
```

## Notes

- This library should only run the the client, it is not for server-side data fetching.
- Requires Pocketbase SDK.
- I've have not been able to get TS generics to work right in the components, so no intellisense on the data and document slot prop.
