# Find any LP token send to the pair

Using a constructor returning a value (via a quick assembly trick), batch lots of calls to Uniswap v2 pair contract (to check if their own balance is not null, as it is some nice mev). The script using it then (static) call the deployment transaction (ie no real deployment, everything's free).


-> Every results (11/2021) is false positive (either value<gas or stuck for whatever reason)

Interest of this repo-> multicall without deployement (returned valuue from constructor then static call)
