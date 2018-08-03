require('better-log/install');

const babelPluginSyntaxTypescript = require('@babel/plugin-syntax-typescript');

module.exports = babel => {
  const { types: t } = babel;

  const nestedVisitor = {
    Identifier(path) {
      if (path.node.name === this.name && !t.isExportSpecifier(path.parent)) {
        const exportParent = path.findParent(p => p.isExportNamedDeclaration());

        if (exportParent) return;

        if (t.isVariableDeclarator(path.parentPath.node)) {
          const parent = path.findParent(p => t.isVariableDeclaration(p));

          parent.replaceWith(
            t.exportNamedDeclaration(parent.node, [
              t.exportSpecifier(
                path.parentPath.node.id,
                path.parentPath.node.id
              )
            ])
          );
        } else if (
          t.isClassDeclaration(path.parentPath.node) ||
          t.isFunctionDeclaration(path.parentPath.node) ||
          t.isTypeAlias(path.parentPath.node) ||
          t.isTSEnumDeclaration(path.parentPath.node) ||
          t.isTSTypeAliasDeclaration(path.parentPath.node) ||
          t.isTSInterfaceDeclaration(path.parentPath.node)
        ) {
          path.parentPath.replaceWith(
            t.exportNamedDeclaration(path.parentPath.node, [
              t.exportSpecifier(
                path.parentPath.node.id,
                path.parentPath.node.id
              )
            ])
          );
        }
      }
    }
  };

  return {
    inherits: babelPluginSyntaxTypescript.default,
    visitor: {
      ExportNamedDeclaration: path => {
        const {
          node: { specifiers }
        } = path;

        if (path.node.isClean || path.node.declaration) return;

        const parsed =
          specifiers &&
          specifiers.length &&
          specifiers.filter(specifier => {
            if (specifier.local.name === specifier.exported.name) {
              path
                .findParent(p => p.isProgram())
                .traverse(nestedVisitor, { name: specifier.local.name });

              return false;
            }

            return true;
          });

        if (parsed && parsed.length) {
          const newExport = t.exportNamedDeclaration(
            null,
            parsed.map(specifier =>
              t.exportSpecifier(specifier.local, specifier.exported)
            )
          );

          newExport.isClean = true;

          path.replaceWith(newExport);
          return;
        }

        path.remove();
      }
    }
  };
};
