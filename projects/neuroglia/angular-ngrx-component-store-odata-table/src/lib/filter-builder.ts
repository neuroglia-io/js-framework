const LPAREN = '(';
const RPAREN = ')';

const AND = '&';
const OR = '|';
const NOT = '!';

const SYMBOLS = [LPAREN, RPAREN, AND, OR, NOT];

enum TokenType {
  Paren = 'paren',
  Logical = 'logical',
  Unary = 'unary',
  Word = 'word',
}

class Token {
  value: string;
  position: number;
  length: number;
  type: TokenType;
  constructor(value: string, position: number) {
    this.position = position;
    this.length = value.length;
    this.value = value.trim();
    switch (value) {
      case LPAREN:
      case RPAREN:
        this.type = TokenType.Paren;
        break;
      case AND:
      case OR:
        this.type = TokenType.Logical;
        break;
      case NOT:
        this.type = TokenType.Unary;
        break;
      default:
        this.type = TokenType.Word;
        break;
    }
  }
}

class TokenGroup {
  tokens: (Token | TokenGroup)[] = [];
  lastIndex: number;
}

class NotNode {
  not: Filter;
}
class AndNode {
  and: Filter[] = [];
}
class OrNode {
  or: Filter[] = [];
}

type Filter = string | NotNode | AndNode | OrNode | Filter[];

/**
 * Used to parse an expression provided by a search box with
 * AND ('$'), OR ('|'), NOT ('!') operators and grouping ('(', ')')
 *
 * e.g.: filterBuilder.parse('foo & bar | (fiz & !baz)')
 * returns
 * {
 *   "or": [
 *       {
 *           "and": [
 *               "contains(qualifiedName, 'foo')",
 *               "contains(qualifiedName, 'bar')"
 *           ]
 *       },
 *       {
 *           "and": [
 *               "contains(qualifiedName, 'fiz')",
 *               {
 *                   "not": "contains(qualifiedName, 'baz')"
 *               }
 *           ]
 *       }
 *   ]
 * }
 */
export class FilterBuilder {
  constructor(private property: string = 'qualifiedName') {}

  parse(expression: string): any {
    const tokens: Token[] = this.tokenize(expression);
    const tokenGroup: TokenGroup = this.group(tokens);
    return this.buildFilter(tokenGroup.tokens);
  }

  private tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    if (!expression) return tokens;
    let position = 0;
    while (position < expression.length) {
      let value = expression[position];
      if (SYMBOLS.includes(value)) {
        tokens.push(new Token(value, position));
        position++;
        continue;
      }
      let word = '';
      while (!SYMBOLS.includes(value) && position < expression.length) {
        word += value;
        value = expression[++position];
      }
      tokens.push(new Token(word, position - word.length));
    }
    return tokens;
  }

  private group(tokens: Token[], position: number = 0): TokenGroup {
    const tokenGroup = new TokenGroup();
    for (let i = position, c = tokens.length; i < c; i++) {
      const token = tokens[i];
      if (!token.value) continue; // remove empty words
      if (token.value === RPAREN) {
        tokenGroup.lastIndex = i;
        return tokenGroup;
      }
      if (token.value === LPAREN) {
        tokenGroup.tokens.push(this.group(tokens, i + 1));
        i = (tokenGroup.tokens[tokenGroup.tokens.length - 1] as TokenGroup).lastIndex;
        tokenGroup.lastIndex = i;
        continue;
      }
      tokenGroup.tokens.push(token);
      tokenGroup.lastIndex = i;
    }
    return tokenGroup;
  }

  private buildFilterForWord(token: Token): string {
    return `contains(tolower(${this.property}), '${token.value.toLowerCase()}')`;
  }

  private buildFilterForGroup(group: TokenGroup): Filter {
    return this.buildFilter(group.tokens);
  }

  private buildFilterForNonSymbol(item: Token | TokenGroup): Filter {
    let filter;
    if (item instanceof TokenGroup) {
      filter = this.buildFilterForGroup(item);
    } else if (item.type === TokenType.Word) {
      filter = this.buildFilterForWord(item);
    } else {
      throw new Error(`Unexpected token with type '${item.type}' and value '${item.value}'.`);
    }
    return filter;
  }

  private buildFilter(tokens: (Token | TokenGroup)[]): Filter {
    let filters: Filter = [];
    for (let i = 0, c = tokens.length; i < c; i++) {
      const token = tokens[i];
      if (token instanceof TokenGroup) {
        const filter = this.buildFilterForGroup(token);
        filters.push(filter);
        continue;
      } else if (token.type === TokenType.Word) {
        const filter = this.buildFilterForWord(token);
        filters.push(filter);
        continue;
      } else if (token.type === TokenType.Unary) {
        const filter = new NotNode();
        const nextToken = tokens[++i];
        if (!nextToken) throw 'Another token is expected after an unary operation';
        filter.not = this.buildFilterForNonSymbol(nextToken);
        filters.push(filter);
        continue;
      } else if (token.type === TokenType.Logical) {
        if (token.value === OR) {
          let filter = filters.find((filter) => filter instanceof OrNode) as OrNode;
          if (!filter) {
            filter = new OrNode();
            filter.or.push(filters.pop() as Filter);
            filters.push(filter);
          }
          const nextToken = tokens[++i];
          if (!nextToken) throw 'Another token is expected after a logical operation';
          if ((nextToken as Token).type === TokenType.Unary) {
            filter.or.push(this.buildFilter([nextToken, tokens[++i]]));
          } else {
            filter.or.push(this.buildFilterForNonSymbol(nextToken));
          }
          continue;
        } else {
          let filter = filters.find((filter) => filter instanceof AndNode) as AndNode;
          if (!filter) {
            filter = new AndNode();
            filter.and.push(filters.pop() as Filter);
            filters.push(filter);
          }
          const nextToken = tokens[++i];
          if (!nextToken) throw 'Another token is expected after a logical operation';
          if ((nextToken as Token).type === TokenType.Unary) {
            filter.and.push(this.buildFilter([nextToken, tokens[++i]]));
          } else {
            filter.and.push(this.buildFilterForNonSymbol(nextToken));
          }
          continue;
        }
      }
    }
    return filters[0];
  }
}
