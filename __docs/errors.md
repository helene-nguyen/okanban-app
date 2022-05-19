# Errors repertory

## Erreurs lors d'une mise à jour d'une carte

Lors de la mise à jour d'une carte, le problème était que l'attribut donné disparaissait et la couleur (qui a bien été mise à jour) a été mise à jour sur le dernier élément et a complètement enlevé la carte ciblée.

Test effectués sur la base de données avec l'extension [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

On remarque que la mise a jour a bien été faite, que la couleur a bien changé sur une carte mais pas la bonne 

Après avoir checké les méthodes et notre base de données, la question qu'on s'est posée est la suivante :

Pourquoi la mise à jour est bien faite ? Pourquoi la dernière carte ? 

On a ciblé très vite le problème au niveau de la récupération des attributs de données


Et après maintes test ...