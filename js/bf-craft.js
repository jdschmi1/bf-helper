/**
 * Created by ZTn on 09/08/2015.
 */

var BfCraft = {
    spheresRecipes: {},
    synthesisRecipes: {},

    synchronizeRecipesCount: 0,

    /**
     * Simplifies the recipes by reducing items used as material to their basic materials.
     * Warning: order of recipes matters !
     *
     * @param recipes
     */
    simplifyRecipes: function (recipes) {
        /**
         * Adds a material to a recipe (creates or updates)
         *
         * @param recipe
         * @param material
         * @param count
         */
        var addMaterialToRecipe = function (recipe, material, count) {
            if (material in recipe) {
                recipe[material] += count;
            }
            else {
                recipe[material] = count;
            }
        };

        var simplifiedRecipes = {};

        angular.forEach(recipes, function (materials, recipe) {
            simplifiedRecipes[recipe] = {};
            angular.forEach(materials, function (count, material) {
                if (material in simplifiedRecipes) {
                    angular.forEach(simplifiedRecipes[material], function (subCount, subMaterial) {
                        addMaterialToRecipe(simplifiedRecipes[recipe], subMaterial, count * subCount);
                    })
                }
                else {
                    addMaterialToRecipe(simplifiedRecipes[recipe], material, count);
                }
            });
        });

        console.log(simplifiedRecipes);
        return simplifiedRecipes;
    },

    /**
     * Returns the materials ie. items used to craft other items
     *
     * @param recipes
     * @returns {<material>: {count:..., materialOf: [...]}}
     */
    getMaterials: function (recipes) {
        var allMaterials = {};

        angular.forEach(recipes, function (materials, recipe) {
            angular.forEach(materials, function (count, material) {
                if (material in allMaterials) {
                    allMaterials[material].count++;
                    allMaterials[material].materialOf.push(recipe);
                }
                else {
                    allMaterials[material] = {material: material, count: 1, materialOf: [recipe]};
                }
            })
        });

        return allMaterials;
    },

    /**
     * Returns all the recipes merged into a single object
     * @returns {*}
     */
    getAllRecipes: function () {
        return angular.extend({}, BfCraft.synthesisRecipes, BfCraft.spheresRecipes);
    },

    /**
     * Returns all simplified recipes merged into a single object
     * @returns {*}
     */
    getAllSimplifiedRecipes: function () {
        return BfCraft.simplifyRecipes(angular.extend({}, BfCraft.synthesisRecipes, BfCraft.spheresRecipes));
    },

    /**
     * Builds the allRecipes object if all recipes were successfully loaded.
     */
    synchronizeRecipes: function (callback) {
        var self = this;

        self.synchronizeRecipesCount++;
        if (self.synchronizeRecipesCount == 2) {
            callback();
        }
    },
};
