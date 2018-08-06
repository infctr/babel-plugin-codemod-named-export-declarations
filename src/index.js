require('better-log/install');

module.exports = babel => {
  const { types: t } = babel;

  const replaceWithExport = (parent, node) => {
    parent.replaceWith(
      t.exportNamedDeclaration(parent.node, [
        t.exportSpecifier(node.id, node.id),
      ])
    );
  };

  const replaceDeclarationWithExport = (path, names) =>
    !t.isExportNamedDeclaration(path.parent) &&
    names.includes(path.node.id.name) &&
    replaceWithExport(path, path.node);

  const nestedVisitor = {
    ClassDeclaration(path) {
      replaceDeclarationWithExport(path, this.names);
    },

    FunctionDeclaration(path) {
      replaceDeclarationWithExport(path, this.names);
    },

    TypeAlias(path) {
      replaceDeclarationWithExport(path, this.names);
    },

    TSEnumDeclaration(path) {
      replaceDeclarationWithExport(path, this.names);
    },

    TSTypeAliasDeclaration(path) {
      replaceDeclarationWithExport(path, this.names);
    },

    TSInterfaceDeclaration(path) {
      replaceDeclarationWithExport(path, this.names);
    },

    VariableDeclaration(path) {
      const declaratorNode =
        path.node.declarations.length === 1 && path.node.declarations[0];

      if (
        !t.isExportNamedDeclaration(path.parent) &&
        this.names.includes(declaratorNode.id.name)
      ) {
        replaceWithExport(path, declaratorNode);
      }
    },
  };

  const isDeclaration = name => node =>
    t.isVariableDeclaration(node)
      ? node.declarations.length === 1 &&
        isDeclaration(name)(node.declarations[0])
      : (t.isClassDeclaration(node) ||
          t.isVariableDeclarator(node) ||
          t.isFunctionDeclaration(node) ||
          t.isTypeAlias(node) ||
          t.isTSEnumDeclaration(node) ||
          t.isTSTypeAliasDeclaration(node) ||
          t.isTSInterfaceDeclaration(node)) &&
        node.id.name === name;

  return {
    name: 'codemod-named-export-declarations',
    visitor: {
      ExportNamedDeclaration: path => {
        const program = path.findParent(p => p.isProgram());

        // Skip export named declarations, reexports or cleaned paths
        if (path.node.isClean || path.node.declaration || path.node.source) {
          return;
        }

        const { exported, declarations } =
          path.node.specifiers &&
          path.node.specifiers.reduce(
            (memo, specifier) =>
              specifier.local.name === specifier.exported.name &&
              program.node.body.some(isDeclaration(specifier.local.name))
                ? { ...memo, declarations: [...memo.declarations, specifier] }
                : { ...memo, exported: [...memo.exported, specifier] },
            { exported: [], declarations: [] }
          );

        if (declarations && declarations.length) {
          program.traverse(nestedVisitor, {
            names: declarations.map(specifier => specifier.local.name),
          });
        }

        // Leave only named exports that are renamed or reexported
        if (exported && exported.length) {
          const newExport = t.exportNamedDeclaration(
            null,
            exported.map(specifier =>
              t.exportSpecifier(specifier.local, specifier.exported)
            )
          );

          newExport.isClean = true;

          path.replaceWith(newExport);
          return;
        }

        // Empty export declaration
        path.remove();
      },
    },
  };
};
