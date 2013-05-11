// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.BuilderScriptListsPage = (function(_super) {

    __extends(BuilderScriptListsPage, _super);

    function BuilderScriptListsPage() {
      return BuilderScriptListsPage.__super__.constructor.apply(this, arguments);
    }

    BuilderScriptListsPage.prototype.on_build = function(block, $container, params) {
      var $script_lists_container, $search, $sendfeedback, param_string, search, size, skip, sort,
        _this = this;
      skip = params['skip'];
      size = params['size'];
      search = params['search'];
      sort = params['sort'];
      if (!(sort != null)) {
        sort = "date";
      }
      params.sort = sort;
      param_string = {};
      param_string.sort = "date";
      params['date_sort_url'] = "/web/script/?" + Utils.generate_parameter_string(param_string);
      param_string.sort = "success_rate";
      params['success_rate_sort_url'] = "/web/script/?" + Utils.generate_parameter_string(param_string);
      if (!(skip != null)) {
        skip = 0;
      }
      if (!(size != null)) {
        size = 10;
      }
      ThemeCompiler.compile_block(block, params, $container);
      if ($search = this.get_element("search")) {
        $search.attr("value", search);
        $search.keyup(function(e) {
          var url;
          if (e.keyCode === KeyCode.KEYCODE_ENTER) {
            search = $search.attr("value");
            param_string.search = search;
            url = "/web/script/?" + Utils.generate_parameter_string(param_string);
            return Utils.redirect_to(url);
          }
        });
      }
      if ($script_lists_container = this.get_element("script_lists")) {
        Script.get_script_lists_with_sort(skip, size, null, sort, search, function(data) {
          block = Blocks("script-lists");
          _this.set_script_lists(block, $script_lists_container, data['lists']);
          return _this.set_pager($script_lists_container, skip, size, function(pageindex) {
            var url_params;
            url_params = {
              skip: pageindex * size,
              size: size,
              search: search,
              sort: sort
            };
            if (search != null) {
              url_params['search'] = search;
            }
            return "/web/script/?" + Utils.generate_parameter_string(url_params, true);
          }, data);
        });
      }
      if ($sendfeedback = this.get_element("sendfeedback")) {
        return $sendfeedback.click(function() {
          return window.open("https://getsatisfaction.com/eternagame/topics/scripting_interface_feedback?rfm=1");
        });
      }
    };

    BuilderScriptListsPage.prototype.set_pager = function($container, skip, size, callback, data) {
      var $pager, pager_str, total_script,
        _this = this;
      if ($pager = this.get_element("pager")) {
        total_script = data['total_script'];
        pager_str = EternaUtils.get_pager(Math.floor(skip / size), Math.ceil(total_script / size), function(pageindex) {
          return callback(pageindex);
        });
        return $pager.html(pager_str);
      }
    };

    BuilderScriptListsPage.prototype.set_script_lists = function(block, $container, lists) {
      var i, nid, script, script_param, script_params, _i, _ref, _results;
      script_params = [];
      _results = [];
      for (i = _i = 0, _ref = lists.length - 1; _i <= _ref; i = _i += 1) {
        script = lists[i];
        script_param = {};
        nid = script['nid'];
        script_param['id'] = nid;
        script_param['title'] = script['title'];
        script_param['name'] = script['author']['name'];
        script_param['uid'] = script['author']['uid'];
        script_param['body'] = script['body'];
        script_param['created'] = script['created'];
        script_param['commentcounts'] = script['commentcounts'];
        script_param['success_rate'] = script['success_rate'];
        script_param['type'] = script['type'];
        if (!(script_param['success_rate'] != null) || isNaN(script_param['success_rate'])) {
          script_param['success_rate'] = "0.00";
        } else {
          script_param['success_rate'] = new Number(script_param['success_rate'] * 100).toFixed(2);
        }
        script_param['tested_time'] = script['tested_time'];
        if (!(script_param['tested_time'] != null)) {
          script_param['tested_time'] = "Please wait for test results";
        }
        _results.push(block.add_block($container, script_param));
      }
      return _results;
    };

    return BuilderScriptListsPage;

  })(Builder);

  this.BuilderScriptPage = (function(_super) {

    __extends(BuilderScriptPage, _super);

    function BuilderScriptPage() {
      return BuilderScriptPage.__super__.constructor.apply(this, arguments);
    }

    BuilderScriptPage.prototype.on_build = function(block, $container, params) {
      var id,
        _this = this;
      params['readonly'] = false;
      if (params['nid'] || params['id']) {
        if (params['nid']) {
          id = params['nid'];
        } else {
          id = params['id'];
        }
        Script.increase_pageview(id, function(data) {});
        return Script.get_script(id, function(data) {
          var script;
          script = data['script'][0];
          params['script'] = script;
          if (params['nid']) {
            params['comments'] = data['comments'];
            return _this.build_script_show(block, $container, params);
          } else {
            return _this.build_script_create(block, $container, params);
          }
        });
      } else {
        return this.build_script_create(block, $container, params);
      }
    };

    BuilderScriptPage.prototype.build_script_create = function(block, $container, params) {
      var $add_input, $input_containers, $save_script, input_count,
        _this = this;
      ThemeCompiler.compile_block(block, params, $container);
      this.initialize_editor(params['readonly']);
      if (params['id']) {
        this.put_script(params['script'], true, false);
      }
      this.initialize_flash();
      this.initialize_pervasives();
      this.initialize_evaluate();
      if ($save_script = this.get_element("submit-script")) {
        $save_script.click(function() {
          if (Application.CURRENT_USER) {
            return _this.save_script();
          } else {
            return alert("Please log in to submit script");
          }
        });
      }
      if ($add_input = this.get_element("add-input")) {
        if ($input_containers = this.get_element("input-containers")) {
          block = Blocks("input-container");
          input_count = 0;
          return $add_input.click(function() {
            block.add_block($input_containers, {
              num: input_count,
              create: true
            });
            return input_count++;
          });
        }
      }
    };

    BuilderScriptPage.prototype.build_script_show = function(block, $container, params) {
      var $start_from_copy,
        _this = this;
      ThemeCompiler.compile_block(block, params, $container);
      if (params['nid']) {
        params['readonly'] = true;
        this.initialize_editor(params['readonly']);
        this.put_script(params['script'], true, true);
      }
      this.initialize_flash();
      this.initialize_pervasives();
      this.initialize_evaluate();
      if ($start_from_copy = this.get_element("start-from-copy")) {
        return $start_from_copy.click(function() {
          var url, url_params;
          url_params = {
            id: params['nid']
          };
          url = "/web/script/create/?" + Utils.generate_parameter_string(url_params);
          return Utils.redirect_to(url);
        });
      }
    };

    BuilderScriptPage.prototype.load_script = function(id, code, input) {
      var _this = this;
      return Script.get_script(id, function(data) {
        var script;
        script = data['script'][0];
        return _this.put_script(script, code, input);
      });
    };

    BuilderScriptPage.prototype.put_script = function(script, code, input) {
      var $author, $description, $input_containers, $pageview, $see_results, $tested_time, $title, $type, author, block, description, i, input_script, input_scripts, name, pageview, type, value, _i, _ref,
        _this = this;
      if (code) {
        this.editor.setValue(script['source']);
        $title = this.get_element("title");
        $title.html(script['title']);
        author = script['author'];
        if ($author = this.get_element("author")) {
          $author.html(author['name']);
          $author.click(function() {
            var url;
            url = "/web/player/" + author['uid'] + "/";
            return Utils.redirect_to(url);
          });
        }
      }
      if (input) {
        if (script['input'] !== null) {
          try {
            input_scripts = JSON.parse(script['input']);
          } catch (Error) {
            input_scripts = [
              {
                name: "name0",
                value: script['input']
              }
            ];
          }
          if ($input_containers = this.get_element("input-containers")) {
            block = Blocks("input-container");
            if (input_scripts.length > 0) {
              for (i = _i = 0, _ref = input_scripts.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                input_script = input_scripts[i];
                name = input_script['name'];
                value = input_script['value'];
                block.add_block($input_containers, {
                  name: name,
                  value: value
                });
              }
            }
          }
        }
      }
      this.load_test_result(script['test']);
      if ($description = this.get_element("description-info")) {
        if (description = script['body']) {
          $description.html(description);
        }
      }
      if ($tested_time = this.get_element("tested-time")) {
        if (!(script['tested_time'] != null)) {
          $tested_time.html("Please wait for test results");
        } else {
          $tested_time.html(script['tested_time']);
        }
      }
      if ($type = this.get_element("type-info")) {
        if (type = script['type']) {
          $type.html(type);
        } else {
          $type.html("Etc");
        }
        if (type !== "Puzzle solving") {
          if ($see_results = this.get_element("see-results")) {
            $see_results.hide();
          }
        }
      }
      if ($pageview = this.get_element("pageview-info")) {
        if (pageview = script['pageview']) {
          return $pageview.html(pageview);
        } else {
          return $pageview.html("0");
        }
      }
    };

    BuilderScriptPage.prototype.load_test_result = function(test_result) {
      var $test_result, block, i, test, test_param, tests, _i, _ref, _results;
      if ($test_result = this.get_element("test-result")) {
        if (tests = test_result) {
          block = Blocks("block-test-result");
          _results = [];
          for (i = _i = 0, _ref = tests.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            test = tests[i];
            test_param = {};
            test_param['puzzle_nid'] = test['nid'];
            test_param['puzzle_title'] = test['name'];
            test_param['num_cleared'] = test['num_cleared'];
            test_param['test_result'] = test['result'];
            test_param['test_cause'] = test['cause'].length > 25 ? test['cause'].substring(0, 25) + "..." : test['cause'];
            test_param['test_time'] = test['eval_time'] / 1000;
            _results.push(block.add_block($test_result, test_param));
          }
          return _results;
        }
      }
    };

    BuilderScriptPage.prototype.save_script = function() {
      var $description, $title, description, input, name, source, title, type;
      if ($title = this.get_element("title")) {
        if ($title.attr('value') === "") {
          alert("You have to write the title!!");
          return;
        }
      }
      if ($description = this.get_element("description")) {
        if ($description.attr('value') === "") {
          alert(" You have to write the description!!");
          return;
        }
      }
      Overlay.set_loading("replying..");
      Overlay.show();
      title = $title.attr('value');
      description = $description.attr('value');
      type = $('#script_type option:selected').val();
      input = this.get_inputs();
      source = this.editor.getValue();
      if (input && input[0]) {
        name = input[0]['value'];
      }
      return Script.post_script(title, source, type, input, null, description, function(data) {
        if (!data['success'] || data['nid'] === null || data['nid'] === void 0) {
          alert("Submit fail. Try again please!!");
        }
        Utils.redirect_to("/web/script/" + data['nid'] + "/");
        return Overlay.hide();
      });
    };

    BuilderScriptPage.prototype.get_tutorial_infos = function() {
      var tutorial_infos;
      tutorial_infos = new Array();
      tutorial_infos.push({
        puzzle: {
          id: "13450",
          title: "Tutorial 6 : Final!",
          secstruct: "(((((...((((...(((....)))...))))...)))))"
        }
      });
      tutorial_infos.push({
        puzzle: {
          id: "496828",
          title: "Tutorial 5 : More Loops!",
          secstruct: ".(.(....).)."
        }
      });
      tutorial_infos.push({
        puzzle: {
          id: "13405",
          title: "Tutorial 4 : Stacks and Loops!",
          secstruct: "((((....))))"
        }
      });
      tutorial_infos.push({
        puzzle: {
          id: "13449",
          title: "Tutorial 3 : Stacks!",
          secstruct: "((((....))))"
        }
      });
      tutorial_infos.push({
        puzzle: {
          id: "13399",
          title: "Tutorial 2 : Pairs!",
          secstruct: "((((....))))"
        }
      });
      tutorial_infos.push({
        puzzle: {
          id: "13375",
          title: "Tutorial 1 : Basics!",
          secstruct: "...."
        }
      });
      return tutorial_infos;
    };

    BuilderScriptPage.prototype.test_scripts = function(input, target_info, source, success_cb, fail_cb) {
      var test,
        _this = this;
      test = new Array();
      return Script.evaluate_script(input, target_info, source, function(data) {
        var i, test_result, test_target, test_targets, _i, _ref;
        test_targets = data['data'];
        for (i = _i = 0, _ref = test_targets.length - 1; _i <= _ref; i = _i += 1) {
          test_target = test_targets[i];
          test_result = {};
          test_result['nid'] = test_target['nid'];
          test_result['name'] = test_target['name'];
          test_result['result'] = test_target['result'];
          test_result['cause'] = test_target['cause'];
          test_result['eval_time'] = test_target['eval_time'];
          test_result['num_cleared'] = test_target['num_cleared'];
          test.push(test_result);
        }
        return success_cb(test);
      }, fail_cb);
    };

    BuilderScriptPage.prototype.initialize_editor = function(readonly) {
      var $code, wrapper;
      if ($code = this.get_element("code")) {
        this.editor = CodeMirror.fromTextArea($code.get(0), {
          lineNumbers: true,
          matchBrackets: true,
          extraKeys: {
            "Enter": "newlineAndIndentContinueComment"
          },
          readOnly: readonly
        });
        if (readonly) {
          wrapper = this.editor.getWrapperElement();
          return $(wrapper).css('background-color', '#BDBDBD');
        }
      }
    };

    BuilderScriptPage.prototype.initialize_flash = function() {
      var attributes, flash_params, flashvars;
      flashvars = {};
      flash_params = {
        allowScriptAccess: "always"
      };
      attributes = {
        id: "viennalib"
      };
      return swfobject.embedSWF("eterna_resources/scriptfold.swf", "viennalib", "0", "0", "9.0.0", false, flashvars, flash_params, attributes);
    };

    BuilderScriptPage.prototype.initialize_pervasives = function() {
      window.clear = this.clear;
      window.out = this.out;
      return window.outln = this.outln;
    };

    BuilderScriptPage.prototype.initialize_evaluate = function() {
      var $code, $documentation, $evaluation, $input,
        _this = this;
      $input = this.get_element("input");
      $code = this.get_element("code");
      if ($evaluation = this.get_element("evaluation")) {
        $evaluation.click(function() {
          _this.clear();
          return _this.on_evaluate();
        });
      }
      if ($documentation = this.get_element("documentation")) {
        return $documentation.click(function() {
          return window.open("/web/script/documentation/functions/");
        });
      }
    };

    BuilderScriptPage.prototype.out = function(result) {
      var $result, value;
      if (this.get_element) {
        if ($result = this.get_element("result")) {
          value = $result.attr('value');
          return $result.attr('value', value + result);
        }
      } else {
        $result = $('#result');
        value = $result.attr('value');
        return $result.attr('value', value + result);
      }
    };

    BuilderScriptPage.prototype.outln = function(result) {
      this.out(result);
      return this.out("\n");
    };

    BuilderScriptPage.prototype.clear = function() {
      var $result;
      if (this.get_element) {
        if ($result = this.get_element("result")) {
          return $result.attr('value', "");
        }
      } else {
        $result = $('#result');
        return $result.attr('value', "");
      }
    };

    BuilderScriptPage.prototype.on_evaluate = function() {
      var $name, $timeout_sec, $value, code, funcs, i, input_array, param, statement, tick, time, timeout, timeout_sec, timer, v, value, worker, _i, _ref,
        _this = this;
      input_array = this.get_inputs();
      param = "";
      if (input_array.length > 0) {
        for (i = _i = 0, _ref = input_array.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          $name = this.get_element(input_array[i]['name']);
          value = input_array[i]['name'] + "-value";
          $value = this.get_element(value);
          v = $value.attr('value').replace(/\n/gi, '\\n');
          param += " var " + $name.attr('value') + "='" + v + "';";
        }
      }
      code = this.editor.getValue();
      timeout_sec = 10;
      if ($timeout_sec = this.get_element("timeout")) {
        value = $timeout_sec.attr('value');
        if (value !== "") {
          timeout_sec = value;
        }
      }
      code = this.insert_timeout(code, timeout_sec);
      if (this.isWebWorkerSupport()) {
        timeout = false;
        tick = 1000;
        worker = new Worker("/workbranch_kws/frontend/jscripts/eterna/script-library.js");
        worker.onmessage = function(event) {
          var data, evaluation;
          data = event.data;
          if (data && data.cmd) {
            evaluation = data.cmd + "('" + data.arg + "')";
            _this.evaluate(evaluation);
          } else {
            _this.outln(data);
            timeout = true;
          }
        };
        this.resetTimeValue();
        time = new Date();
        timer = function() {
          var hour, min, sec, _time;
          _time = new Date();
          _time.setTime(_time.getTime() - time.getTime());
          hour = _time.getHours();
          min = _time.getMinutes();
          sec = _time.getSeconds();
          _this.setTimeValue(hour, min, sec);
          if (!timeout) {
            return setTimeout(timer, tick);
          } else {

          }
        };
        setTimeout(timer, tick);
        funcs = eval("var funcs='';for(var method in this) funcs+='function '+method+'(_arg){postMessage({cmd:\"'+method+'\",arg:_arg});};'; funcs;");
        statement = "function lambda(){" + param + code + "};lambda();";
        param = funcs + statement;
        return worker.postMessage(param);
      } else {
        try {
          return this.outln(this.evaluate(param + code));
        } catch (Error) {
          return this.outln(Error);
        }
      }
    };

    BuilderScriptPage.prototype.insert_timeout = function(source, timeout) {
      var chunk, code, index, inserted_code, nextRegexp, nextline, regexp;
      inserted_code = "if((new Date()).getTime() - global_timer.getTime() > " + timeout * 1000 + ") {outln(\"" + timeout + "sec timeout\");return;};";
      regexp = /while\s*\([^\)]*\)\s*\{?|for\s*\([^\)]*\)\s*\{?/;
      code = "var global_timer = new Date(); ";
      while (source.search(regexp) !== -1) {
        chunk = source.match(regexp)[0];
        index = source.indexOf(chunk) + chunk.length;
        if ((chunk.charAt(chunk.length - 1)) !== "{") {
          nextRegexp = /.*[\(.*\)|[^;]|\n]*;{0,1}/;
          nextline = source.substring(index);
          nextline = nextline.match(nextRegexp)[0];
          code += source.substring(0, index) + "{" + inserted_code + nextline + "}";
          index += nextline.length;
        } else {
          code += source.substring(0, index) + inserted_code;
        }
        if (source.length > index) {
          source = source.substring(index);
        } else {
          source = "";
          break;
        }
      }
      code += source;
      return code;
    };

    BuilderScriptPage.prototype.evaluate = function(source) {
      var Lib, result, statement;
      Lib = new Library;
      statement = "function lambda(){" + source + "};";
      result = eval(statement + "lambda();");
      return "\nReturn value : " + result;
    };

    BuilderScriptPage.prototype.isWebWorkerSupport = function() {
      return false;
    };

    BuilderScriptPage.prototype.resetTimeValue = function() {
      return this.setTimeValue(0, 0, 0);
    };

    BuilderScriptPage.prototype.setTimeValue = function(hour, min, sec) {
      var $hour, $min, $sec;
      if ($hour = this.get_element("timer-hour")) {
        $hour.html(this.format(hour));
      }
      if ($min = this.get_element("timer-min")) {
        $min.html(this.format(min));
      }
      if ($sec = this.get_element("timer-sec")) {
        return $sec.html(this.format(sec));
      }
    };

    BuilderScriptPage.prototype.format = function(num) {
      if (parseInt(num) < 10) {
        return String("0" + num);
      } else {
        return String(num);
      }
    };

    BuilderScriptPage.prototype.get_inputs = function() {
      var $input_form, arr, i, input, result, _i, _ref;
      if ($input_form = this.get_element("input-form")) {
        arr = $input_form.serializeArray();
        if (arr.length > 0) {
          result = new Array;
          for (i = _i = 0, _ref = arr.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            input = arr[i];
            if (input['value'] !== "") {
              result.push(input);
            }
          }
          return result;
        }
      }
      return [];
    };

    BuilderScriptPage.prototype.get_source = function() {
      if (this.editor) {
        return this.editor.getValue();
      }
      return "";
    };

    return BuilderScriptPage;

  })(Builder);

  this.BuilderInput = (function(_super) {

    __extends(BuilderInput, _super);

    function BuilderInput() {
      return BuilderInput.__super__.constructor.apply(this, arguments);
    }

    BuilderInput.prototype.on_build = function(block, $container, params) {
      var $delete;
      ThemeCompiler.compile_block(block, params, $container);
      if ($delete = this.get_element("delete")) {
        return $delete.click(function() {
          return $container.html("");
        });
      }
    };

    return BuilderInput;

  })(Builder);

  this.BuilderScriptTestResultPage = (function(_super) {

    __extends(BuilderScriptTestResultPage, _super);

    function BuilderScriptTestResultPage() {
      return BuilderScriptTestResultPage.__super__.constructor.apply(this, arguments);
    }

    BuilderScriptTestResultPage.prototype.on_build = function(block, $container, params) {
      var $after_result_more, $before_result_more,
        _this = this;
      this.size = 20;
      this.before_skip = this.size;
      this.after_skip = this.size;
      ThemeCompiler.compile_block(block, params, $container);
      this.generate_testresult(params['nid'], params);
      if ($before_result_more = this.get_element("before-result-more")) {
        $before_result_more.click(function() {
          _this.request_test_result_before(params['nid'], _this.before_skip, _this.size);
          return _this.before_skip += _this.size;
        });
      }
      if ($after_result_more = this.get_element("after-result-more")) {
        return $after_result_more.click(function() {
          _this.request_test_result_after(params['nid'], _this.after_skip, _this.size);
          return _this.after_skip += _this.size;
        });
      }
    };

    BuilderScriptTestResultPage.prototype.show_record = function($container, success, fail) {
      var block, record;
      block = Blocks("block-test-record");
      record = [];
      record['total'] = success + fail;
      if (isNaN(record['total'])) {
        record['total'] = 0;
      }
      record['success'] = success;
      if (isNaN(record['success'])) {
        record['success'] = 0;
      }
      record['fail'] = fail;
      if (isNaN(record['fail'])) {
        record['fail'] = 0;
      }
      if (record['total'] > 0) {
        record['rate'] = (record['success'] / record['total'] * 100).toFixed(2);
      } else {
        record['rate'] = 0;
      }
      return block.add_block($container, record);
    };

    BuilderScriptTestResultPage.prototype.generate_testresult = function(script_nid, params) {
      var $aloading, $bloading,
        _this = this;
      $bloading = this.get_element("before-loading");
      $bloading.show();
      $aloading = this.get_element("after-loading");
      $aloading.show();
      return Script.get_script_with_test(script_nid, this.skip, this.size, function(data) {
        var $record, $record_after, $record_before, $tested_time, after, before, script, test;
        _this.skip += _this.size;
        script = data['script'][0];
        if ($tested_time = _this.get_element("tested-time")) {
          if (!(script['tested_time'] != null)) {
            $tested_time.html("Please wait for test results");
          } else {
            $tested_time.html(script['tested_time']);
          }
        }
        test = script['test'];
        if (test) {
          before = test['before'];
          after = test['after'];
          if ($record = _this.get_element("record")) {
            _this.show_record($record, test['before']['success'] + test['after']['success'], test['before']['fail'] + test['after']['fail']);
          }
          if ($record_before = _this.get_element("record-before")) {
            _this.show_record($record_before, test['before']['success'], test['before']['fail']);
          }
          if ($record_after = _this.get_element("record-after")) {
            _this.show_record($record_after, test['after']['success'], test['after']['fail']);
          }
          _this.load_test_result(before['test'], after['test']);
        }
        $bloading.hide();
        return $aloading.hide();
      });
    };

    BuilderScriptTestResultPage.prototype.load_test_result = function(before, after) {
      var $test_result_after, $test_result_before;
      if ($test_result_before = this.get_element("test-result-before")) {
        this.load_test_result_with_container($test_result_before, before);
      }
      if ($test_result_after = this.get_element("test-result-after")) {
        return this.load_test_result_with_container($test_result_after, after);
      }
    };

    BuilderScriptTestResultPage.prototype.request_test_result_before = function(nid, skip, size) {
      var $loading,
        _this = this;
      $loading = this.get_element("before-loading");
      $loading.show();
      return Script.get_script_with_test(nid, skip, size, function(data) {
        var $test_result_before, script;
        script = data['script'][0];
        if ($test_result_before = _this.get_element("test-result-before")) {
          _this.load_test_result_with_container($test_result_before, script['test']['before']['test']);
        }
        return $loading.hide();
      });
    };

    BuilderScriptTestResultPage.prototype.request_test_result_after = function(nid, skip, size) {
      var $loading,
        _this = this;
      $loading = this.get_element("after-loading");
      $loading.show();
      return Script.get_script_with_test(nid, skip, size, function(data) {
        var $test_result_after, script;
        script = data['script'][0];
        if ($test_result_after = _this.get_element("test-result-after")) {
          _this.load_test_result_with_container($test_result_after, script['test']['after']['test']);
        }
        return $loading.hide();
      });
    };

    BuilderScriptTestResultPage.prototype.load_test_result_with_container = function($container, result) {
      if ($container) {
        if (result.length > 0) {
          return this.load_test_result_packer($container, result);
        } else {
          return $container.find('#noresult').show();
        }
      }
    };

    BuilderScriptTestResultPage.prototype.load_test_result_packer = function($test_result, testresults) {
      var block, test, test_param, test_result_params, _i, _len, _results,
        _this = this;
      block = Blocks("test-result-block");
      test_result_params = [];
      _results = [];
      for (_i = 0, _len = testresults.length; _i < _len; _i++) {
        test = testresults[_i];
        test_param = {};
        test_param['puzzle_nid'] = test['nid'];
        test_param['puzzle_title'] = test['name'];
        test_param['num_cleared'] = test['num_cleared'];
        test_param['test_result'] = test['result'];
        test_param['test_cause'] = test['cause'];
        test_param['test_time'] = test['eval_time'] / 1000;
        test_result_params.push(test_param);
        block.add_block($test_result, test_param);
        _results.push((function(test_param) {
          var $show_sequence, $test_cause;
          if ($show_sequence = _this.get_element(test_param['puzzle_nid'] + '_show_sequence')) {
            if ($test_cause = _this.get_element(test_param['puzzle_nid'] + '_test_cause')) {
              $test_cause.hide();
              return $show_sequence.click(function() {
                $show_sequence.hide();
                return $test_cause.show();
              });
            }
          }
        })(test_param));
      }
      return _results;
    };

    return BuilderScriptTestResultPage;

  })(Builder);

}).call(this);