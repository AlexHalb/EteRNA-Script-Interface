// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty;

  this.ThemeCompiler = {
    BLOCK_ID_COUNTER: 0,
    BLOCK_ID_PREFIX: "_pbid-",
    get_attrs: function(str) {
      var val;
      val = new Object();
      str.replace(/\s*([a-zA-Z0-9]+)\s*=\s*"([^"]+)"/gi, function(m, key, value) {
        return val[key.toLowerCase()] = value;
      });
      return val;
    },
    get_attr_value: function(str) {
      var val;
      val = new Object();
      str.replace(/\s*([^:]+)\s*:\s*([^;]+)\s*;?/g, function(m, key, value) {
        return val[key.toLowerCase()] = value;
      });
      return val;
    },
    get_attr_value_string: function(obj) {
      var key, strs, val;
      if (!(obj != null)) {
        return "";
      }
      strs = new Array();
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        val = obj[key];
        strs.push(key);
        strs.push(":");
        strs.push(val);
        strs.push(";");
      }
      return strs.join('');
    },
    get_tag_header: function(tag, attrs_obj) {
      var full_phrase, key, rephrase, val;
      rephrase = new Array();
      rephrase.push("<", tag, " ");
      for (key in attrs_obj) {
        if (!__hasProp.call(attrs_obj, key)) continue;
        val = attrs_obj[key];
        if (val != null) {
          rephrase.push(key, "=\"", val, "\" ");
        }
      }
      rephrase.push(">");
      full_phrase = rephrase.join('');
      return full_phrase;
    },
    compile_block: function(block, contents, $container) {
      var $block_container, attrs_obj, block_attrs, block_builder, block_class, block_default_attrs, block_id, block_inputs, block_name, block_object, block_tag, blocks, cache_key, compile_context, compiled_cache, compiled_is_blocks, compiled_need_evaluations, compiled_tokens, context_variables, default_style, dom_stack, else_match, end_i, evaluation, exp, final_tokens, for_end_match, for_match, full_phrase, id, if_end_match, if_evaluation, if_match, ii, init_i, instance_style, is_block, is_blocks, key, last_block, last_tag, lowercasekey, match, need_evaluations, need_rephrase, parent, phrase, phrase_match, pop_block, program_block, program_stack, skip, skip_trigger, stylekey, styleval, tag, tag_closer, template, tokens, transition, val, value, _i, _j, _k, _l, _len, _m, _ref, _ref1, _ref2, _ref3, _results;
      if (!block) {
        Utils.display_error("NULL block in compile_block");
        return null;
      }
      if (!$container) {
        Utils.display_error("Null or invalid JElement in ThemeCompiler.compile " + theme);
        return null;
      }
      template = block.template_string_;
      if (!template) {
        Utils.display_error("Block template doesn't exist");
        return null;
      }
      context_variables = block.template_context_variables_;
      if (!(context_variables != null)) {
        match = template.match(/({.+?})|(<.+?>)|([^\s{}<>][^{}<>]*)/gi);
        context_variables = new Array();
        if (match) {
          for (ii = _i = 0, _ref = match.length - 1; _i <= _ref; ii = _i += 1) {
            phrase = match[ii];
            phrase_match = null;
            if (phrase_match = /^{(.+)}$/i.exec(phrase)) {
              if_match = null;
              for_match = null;
              if (if_match = /\s*IF\s+(.+)/.exec(phrase_match[1])) {
                exp = if_match[1];
                this.get_free_variables(exp, context_variables);
              } else if (for_match = /\s*FOR\s+([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+):([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)\s*/.exec(phrase_match[1])) {
                this.get_free_variables(for_match[2], context_variables);
                this.get_free_variables(for_match[3], context_variables);
                this.get_free_variables(for_match[4], context_variables);
              }
            }
          }
        } else {
          match = new Array();
        }
        block.template_context_variables_ = context_variables;
        block.template_tokens_ = match;
      }
      cache_key = "";
      compile_context = null;
      if (contents != null) {
        compile_context = new Object();
        for (ii = _j = 0, _ref1 = context_variables.length - 1; _j <= _ref1; ii = _j += 1) {
          compile_context[context_variables[ii]] = contents[context_variables[ii]];
        }
        cache_key = Utils.generate_parameter_string(compile_context);
      }
      dom_stack = new Array();
      program_stack = new Array();
      skip = false;
      skip_trigger = null;
      compiled_cache = block.template_compiled_cache_[cache_key];
      if (!(compiled_cache != null)) {
        compiled_tokens = new Array();
        compiled_need_evaluations = new Array();
        compiled_is_blocks = new Array();
        if (!contents) {
          contents = new Object();
          compile_context = new Object();
        } else {
          if (!compile_context) {
            Utils.display_error("Compile context is null!");
            return null;
          }
        }
        match = block.template_tokens_;
        if (!(match != null)) {
          Utils.display_error("Can't find theme parses");
          return null;
        }
        for (ii = _k = 0, _ref2 = match.length - 1; _k <= _ref2; ii = _k += 1) {
          phrase = match[ii];
          phrase_match = null;
          parent = dom_stack.last();
          if (phrase_match = /^{(.+)}$/i.exec(phrase)) {
            if_match = null;
            else_match = null;
            for_match = null;
            if_end_match = null;
            for_end_match = null;
            if (if_match = /\s*IF\s+(.+)/.exec(phrase_match[1])) {
              exp = if_match[1];
              program_block = new Object();
              program_block['blockname'] = "IF";
              program_block['is_true'] = true;
              program_stack.push(program_block);
              if_evaluation = this.evaluate(exp, compile_context);
              if (!if_evaluation || if_evaluation === "false") {
                program_block['is_true'] = false;
                if (skip_trigger === null) {
                  skip_trigger = program_block;
                }
              }
            } else if (else_match = /\s*ELSE\s*/.exec(phrase_match[1])) {
              last_block = program_stack.last();
              if (last_block['blockname'] !== "IF") {
                Utils.display_error("Block mismatch " + pop_block['blockname'] + " & ELSE");
                return null;
              }
              if (last_block['is_true'] === false) {
                if (skip_trigger === last_block) {
                  skip_trigger = null;
                } else if (!skip_trigger) {
                  Utils.display_error("IF evaluation and skip trigger doesn't match");
                  return null;
                }
              } else {
                if (!skip_trigger) {
                  skip_trigger = last_block;
                }
              }
            } else if (if_end_match = /\s*ENDIF\s*/.exec(phrase_match[1])) {
              if (program_stack.length < 1) {
                Utils.display_error("Unmatched {ENDIF}");
                return null;
              }
              pop_block = program_stack.pop();
              if (pop_block['blockname'] !== "IF") {
                Utils.display_error("Block mismatch " + pop_block['blockname'] + " & IF");
                return null;
              }
              if (pop_block === skip_trigger) {
                skip_trigger = null;
              }
            } else if (for_match = /\s*FOR\s+([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_]+):([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)\s*/.exec(phrase_match[1])) {
              program_block = new Object();
              program_block['blockname'] = "FOR";
              program_block['entry_point'] = ii;
              program_block['variable'] = for_match[1];
              program_block['end_condition'] = for_match[3];
              program_block['step_size'] = this.evaluate(for_match[4], compile_context);
              if (Utils.is_int(program_block['step_size']) !== true) {
                Utils.display_error("Theme warning : FOR step_size is not integer. Defaulting to 1");
                program_block['step_size'] = 1;
              }
              this.assign_in_context(program_block['variable'], this.evaluate(for_match[2], compile_context), compile_context);
              init_i = this.evaluate(program_block['variable'], compile_context);
              end_i = this.evaluate(program_block['end_condition'], compile_context);
              if (Utils.is_int(init_i) !== true) {
                Utils.display_error("Theme Warning : init_i " + init_i + " could not be evaluated");
                init_i = null;
              }
              if (Utils.is_int(end_i) !== true) {
                Utils.display_error("Theme Warning : end_i " + program_block['end_condition'] + " could not be evaluated");
                end_i = null;
              }
              if (Utils.equals_null(init_i) || Utils.equals_null(end_i) || init_i >= end_i) {
                if (!skip_trigger) {
                  skip_trigger = program_block;
                }
              }
              program_stack.push(program_block);
            } else if (for_end_match = /\s*ENDFOR\s*/.exec(phrase_match[1])) {
              last_block = program_stack.last();
              if (last_block['blockname'] !== "FOR") {
                Utils.display_error("Block mismatch " + last_block['blockname'] + " & FOR");
                return null;
              }
              this.assign_in_context(last_block['variable'], this.evaluate(last_block['variable'], compile_context) + last_block['step_size'], compile_context);
              init_i = this.evaluate(last_block['variable'], compile_context);
              end_i = this.evaluate(last_block['end_condition'], compile_context);
              if (Utils.is_int(init_i) !== true) {
                Utils.display_error("Warning : init_i " + init_i + " could not be evaluated");
                init_i = null;
              }
              if (Utils.is_int(end_i) !== true) {
                Utils.display_error("Warning : end_i " + end_i + " could not be evaluated");
                end_i = null;
              }
              if (Utils.equals_null(init_i) || Utils.equals_null(end_i) || init_i >= end_i) {
                program_stack.pop();
                if (last_block === skip_trigger) {
                  skip_trigger = null;
                }
              } else {
                ii = last_block['entry_point'];
              }
            } else {
              if (skip_trigger !== null) {
                continue;
              }
              key = phrase_match[1];
              evaluation = this.evaluate(key, compile_context);
              if (evaluation != null) {
                compiled_tokens.push(evaluation);
                compiled_need_evaluations.push(false);
                compiled_is_blocks.push(false);
              } else {
                compiled_tokens.push(phrase_match[0]);
                compiled_need_evaluations.push(true);
                compiled_is_blocks.push(false);
              }
            }
          } else if (phrase_match = /^<([\/a-zA-Z0-9:\-]+).*>$/i.exec(phrase)) {
            if (skip_trigger) {
              continue;
            }
            if (phrase_match[1].charAt(0) === "/") {
              if (dom_stack.length === 0) {
                Utils.display_error("Unbalanced tag closing : closing on empty dom stack");
                continue;
              }
              last_tag = dom_stack.pop();
              tag_closer = phrase_match[1].substring(1).toLowerCase();
              if ((last_tag != null) && last_tag !== tag_closer) {
                Utils.display_error("Unbalanced tag openings/closings : " + last_tag + " expected but was " + tag_closer);
                return;
              }
              if (tag_closer === "block") {
                continue;
              }
              compiled_tokens.push(phrase_match[0]);
              compiled_need_evaluations.push(false);
              compiled_is_blocks.push(false);
            } else {
              full_phrase = phrase_match[0];
              tag = phrase_match[1].toLowerCase();
              is_block = false;
              if (tag === "block") {
                is_block = true;
                attrs_obj = this.get_attrs(phrase_match[0]);
                if (block_name = attrs_obj['name']) {
                  block_object = BlockManager.get_block(block_name);
                  if (!block_object) {
                    Utils.display_error("Can't find a block " + block_name);
                    continue;
                  }
                  block_default_attrs = block_object.get_default_attrs();
                  for (key in block_default_attrs) {
                    if (!__hasProp.call(block_default_attrs, key)) continue;
                    val = block_default_attrs[key];
                    if (!(attrs_obj[key] != null)) {
                      attrs_obj[key] = val;
                    } else {
                      lowercasekey = key.toLowerCase();
                      if (lowercasekey.toLowerCase() === "style") {
                        default_style = this.get_attr_value(val);
                        if (default_style != null) {
                          instance_style = this.get_attr_value(attrs_obj[key]);
                          for (stylekey in instance_style) {
                            if (!__hasProp.call(instance_style, stylekey)) continue;
                            styleval = instance_style[stylekey];
                            default_style[stylekey] = styleval;
                          }
                          attrs_obj[key] = this.get_attr_value_string(default_style);
                        }
                      } else if (lowercasekey.toLowerCase() === "class") {
                        attrs_obj[key] = val + " " + attrs_obj[key];
                      }
                    }
                  }
                  full_phrase = this.get_tag_header(tag, attrs_obj);
                }
              }
              full_phrase = this.evaluate_safe(full_phrase, compile_context);
              attrs_obj = this.get_attrs(full_phrase);
              need_rephrase = false;
              if (id = attrs_obj['id']) {
                if (id.indexOf(this.BLOCK_ID_PREFIX) >= 0) {
                  Utils.display_error("You cannot use html ID with prefix " + this.BLOCK_ID_PREFIX(+". Prefixing '_'"));
                  attrs_obj['id'] = "_" + attrs_obj['id'];
                  need_rephrase = true;
                }
              }
              if (tag === "a" && (attrs_obj['transition'] != null)) {
                transition = attrs_obj['transition'];
                if (transition === "overlay") {
                  if (!(this.transition_overlay_cb_id_ != null)) {
                    this.transition_overlay_cb_id_ = CallbackManager.register_callback(function(e, href) {
                      var $e;
                      $e = $.Event(e);
                      $e.preventDefault();
                      href = Utils.to_uri(String(href));
                      return Page.transit(href, true);
                    });
                  }
                  attrs_obj["onClick"] = "CallbackManager.get_callback(" + this.transition_overlay_cb_id_ + ")(event,this)";
                  need_rephrase = true;
                } else if (transition === "page") {
                  if (!(this.transition_page_cb_id_ != null)) {
                    this.transition_page_cb_id_ = CallbackManager.register_callback(function(e, href) {
                      var $e;
                      $e = $.Event(e);
                      $e.preventDefault();
                      href = Utils.to_uri(String(href));
                      return Page.transit(href, false);
                    });
                  }
                  attrs_obj["onClick"] = "CallbackManager.get_callback(" + this.transition_page_cb_id_ + ")(event,this)";
                  need_rephrase = true;
                }
              }
              if (need_rephrase) {
                full_phrase = this.get_tag_header(tag, attrs_obj);
              }
              dom_stack.push(tag);
              compiled_tokens.push(full_phrase);
              compiled_need_evaluations.push(this.need_evaluation(full_phrase));
              compiled_is_blocks.push(is_block);
            }
          } else {
            if (skip_trigger) {
              continue;
            }
            compiled_tokens.push(phrase);
            compiled_need_evaluations.push(false);
            compiled_is_blocks.push(false);
          }
        }
        block.template_compiled_cache_[cache_key] = compiled_cache = {
          tokens: compiled_tokens,
          need_evaluations: compiled_need_evaluations,
          is_blocks: compiled_is_blocks
        };
      }
      final_tokens = new Array();
      tokens = compiled_cache.tokens;
      need_evaluations = compiled_cache.need_evaluations;
      is_blocks = compiled_cache.is_blocks;
      blocks = new Array();
      for (ii = _l = 0, _ref3 = tokens.length - 1; _l <= _ref3; ii = _l += 1) {
        if (is_blocks[ii]) {
          if (need_evaluations[ii]) {
            block_attrs = this.get_attrs(tokens[ii]);
            for (key in block_attrs) {
              if (!__hasProp.call(block_attrs, key)) continue;
              value = block_attrs[key];
              if (key === "input") {
                block_inputs = this.get_attr_value(value);
                block_attrs[key] = this.evaluate_object(block_inputs, contents);
              } else {
                block_attrs[key] = this.evaluate_safe(value, contents);
              }
            }
          } else {
            phrase = tokens[ii];
            block_attrs = this.get_attrs(phrase);
          }
          block_id = block_attrs['id'];
          block_tag = block_attrs['tag'];
          block_name = block_attrs['name'];
          block_builder = block_attrs['builder'];
          block_inputs = block_attrs['input'];
          if ((block_inputs != null) && typeof block_inputs === "string") {
            block_inputs = this.get_attr_value(block_inputs);
          }
          if (!(block_tag != null)) {
            block_tag = "div";
          }
          if (!(block_id != null)) {
            block_attrs['id'] = block_id = this.BLOCK_ID_PREFIX + this.BLOCK_ID_COUNTER;
            this.BLOCK_ID_COUNTER++;
          }
          final_tokens.push("<");
          final_tokens.push(block_tag);
          final_tokens.push(" ");
          for (key in block_attrs) {
            if (!__hasProp.call(block_attrs, key)) continue;
            val = block_attrs[key];
            final_tokens.push(key);
            final_tokens.push("=\"");
            final_tokens.push(val);
            final_tokens.push("\" ");
          }
          final_tokens.push(">");
          final_tokens.push("</");
          final_tokens.push(block_tag);
          final_tokens.push(">");
          blocks.push({
            id: block_id,
            name: block_name,
            builder: block_builder,
            input: block_inputs
          });
        } else {
          if (need_evaluations[ii]) {
            final_tokens.push(this.evaluate_safe(tokens[ii], contents));
          } else {
            final_tokens.push(tokens[ii]);
          }
        }
      }
      $container.append(final_tokens.join(''));
      _results = [];
      for (_m = 0, _len = blocks.length; _m < _len; _m++) {
        block = blocks[_m];
        block_id = block.id;
        $block_container = $container.find("#" + block_id);
        if ($block_container.exists()) {
          block_class = Blocks(block.name);
          if (!(block_class != null)) {
            Utils.display_error("COMPILE ERROR : can't find a block class " + block.name);
          }
          _results.push(block_class.build($block_container, block.input));
        } else {
          _results.push(Utils.display_error("COMPILE ERROR : can't find a block container " + block_id));
        }
      }
      return _results;
    },
    evaluate: function(name, context) {
      var arg_match, array, array_match, array_name, compare_match, index, index_name, lhs, name_match, number_match, object, object_match, object_name, property_name, reg_match, rhs, string_match, string_name, string_op_match, translation, wrongname_match;
      number_match = null;
      compare_match = null;
      string_match = null;
      array_match = null;
      wrongname_match = null;
      name_match = null;
      if (number_match = /^\s*(\d+)\s*$/.exec(name)) {
        return parseInt(number_match[1]);
      }
      if (string_match = /^'([^']*)'$/.exec(name)) {
        return string_match[1];
      }
      if (string_match = /^"([^"]*)"$/.exec(name)) {
        return string_match[1];
      }
      if (name_match = /^[A-Z0-9a-z_]+$/.exec(name)) {
        translation = context[name];
        if (translation != null) {
          return translation;
        } else {
          return null;
        }
      } else if (compare_match = /^([^=]*[^\s=])\s*==\s*([^=]*[^=\s])\s*$/.exec(name)) {
        lhs = this.evaluate(compare_match[1], context);
        rhs = this.evaluate(compare_match[2], context);
        return lhs === rhs;
      } else if (array_match = /^([A-Za-z0-9_]+)\[([^\]]+)\]$/.exec(name)) {
        array_name = array_match[1];
        index_name = array_match[2];
        index = this.evaluate(index_name, context);
        if (Utils.is_int(index) !== true) {
          return null;
        }
        array = context[array_name];
        if (typeof array !== "object") {
          return "{" + array_name + "[" + index + "]" + "}";
        }
        return array[index];
      } else if (object_match = /^([A-Za-z0-9_]+)\.(.+)$/.exec(name)) {
        object_name = object_match[1];
        if (object_name === "STRING") {
          if (string_op_match = /^([A-Za-z]+)\((.+)\)$/.exec(object_match[2])) {
            if (string_op_match[1] === "replace") {
              if ((arg_match = /^([A-Za-z0-9_]+)\s*,\s*(.+)\s*,\s*['"](.+)['"]$/.exec(string_op_match[2])) && arg_match.length === 4) {
                if (string_name = this.evaluate(arg_match[1], context)) {
                  if (reg_match = /^\/([^\/])\/([igm]*)$/.exec(arg_match[2])) {
                    return string_name.replace(new RegExp(reg_match[1], reg_match[2]), arg_match[3]);
                  } else {
                    return string_name.replace(arg_match[2].replace(/['"]/g, ""), arg_match[3]);
                  }
                }
              }
            }
          }
          return null;
        } else {
          property_name = object_match[2];
          object = this.evaluate(object_name, context);
          if (object != null) {
            return object[property_name];
          }
        }
        return null;
      }
      return null;
    },
    evaluate_safe: function(name, context) {
      var evaluated_string, name_len, ret_obj,
        _this = this;
      if (typeof name !== "string") {
        return name;
      }
      ret_obj = null;
      name_len = name.length;
      evaluated_string = name.replace(/{([^}]*)}/g, function(m, value) {
        var evaluated;
        evaluated = _this.evaluate(value, context);
        if (evaluated != null) {
          if (typeof evaluated === "object") {
            if (name_len === value.length + 2) {
              ret_obj = evaluated;
            } else {
              return "Object";
            }
          }
          return evaluated;
        }
        return m;
      });
      if (ret_obj != null) {
        return ret_obj;
      }
      return evaluated_string;
    },
    evaluate_object: function(obj, context) {
      var evaluated, key, val;
      if (obj != null) {
        for (key in obj) {
          if (!__hasProp.call(obj, key)) continue;
          val = obj[key];
          if (typeof val === "object") {
            this.evaluate_object(val, context);
          } else {
            evaluated = this.evaluate_safe(val, context);
            if (evaluated != null) {
              obj[key] = evaluated;
            }
          }
        }
        return obj;
      }
    },
    need_evaluation: function(str) {
      if (/{[^}]*}/.exec(str)) {
        return true;
      }
      return false;
    },
    assign_in_context: function(name, value, context) {
      return context[name] = value;
    },
    get_free_variables: function(name, variables) {
      var arg_match, array_match, array_name, compare_match, index_name, name_match, number_match, object_match, object_name, string_match, string_op_match, wrongname_match,
        _this = this;
      number_match = null;
      compare_match = null;
      string_match = null;
      array_match = null;
      wrongname_match = null;
      name_match = null;
      if (number_match = /^\s*(\d+)\s*$/.exec(name)) {
        return;
      }
      if (string_match = /^'([^'}]*)'$/.exec(name)) {
        return;
      }
      if (string_match = /^"([^"}]*)"$/.exec(name)) {
        return;
      }
      if (name_match = /^[A-Z0-9a-z_]+$/.exec(name)) {
        variables.push(name);
        return;
      } else if (compare_match = /^([^=]*[^\s=])\s*==\s*([^=]*[^=\s])\s*$/.exec(name)) {
        this.get_free_variables(compare_match[1], variables);
        this.get_free_variables(compare_match[2], variables);
        return;
      } else if (array_match = /^([A-Za-z0-9_]+)\[([^\]]+)\]$/.exec(name)) {
        array_name = array_match[1];
        index_name = array_match[2];
        variables.push(array_name);
        variables.push(index_name);
        return;
      } else if (object_match = /^([A-Za-z0-9_]+)\.(.+)$/.exec(name)) {
        object_name = object_match[1];
        if (object_name === "STRING") {
          if (string_op_match = /^([A-Za-z]+)\((.+)\)$/.exec(object_match[2])) {
            if (string_op_match[1] === "replace") {
              if ((arg_match = /^([A-Za-z0-9_]+)\s*,\s*(.+)\s*,\s*['"](.+)['"]$/.exec(string_op_match[2])) && arg_match.length === 4) {
                variables.push(arg_match[1]);
              }
            }
          }
        } else {
          variables.push(object_name);
        }
        return;
      } else if (wrongname_match = /^[^}]+$/.exec(name)) {
        Utils.display_error("Wrong variable name " + wrongname_match);
        return null;
      }
      return name.replace(/{([^}]*)}/g, function(m, variable) {
        return variables.push(_this.get_free_variables(variable, variables));
      });
    }
  };

}).call(this);