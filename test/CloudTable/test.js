describe("Table Tests", function (done) {

    before(function(){
        CB.appKey = CB.masterKey;
    });

    it("Should Give all the tables", function (done) {

        this.timeout(30000);

        CB.CloudTable.getAll().then(function(res){
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should Give specific tables", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudTable('Role');
        CB.CloudTable.get(obj).then(function(res){
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should give table with tableName",function(done){

        this.timeout(10000);

        CB.CloudTable.get('Employee').then(function(res) {
            if(res){
                done();
            }else
                done("Unable to Get table by name");                
        },function(err){
            done(err);           
        });
    });

     it("should update column name ",function(done){
        this.timeout(50000);
        var table=new CB.CloudTable('NewTable');
        var column=new CB.Column('a');
        table.addColumn(column);
        column=new CB.Column('b');
        table.addColumn(column);
        table.save().then(function(table){
            //new table created
            //add sample data;
            var obj1=new CB.CloudObject('NewTable');
            obj1.set('a','a1');
            obj1.set('b','b1');
            var obj2=new CB.CloudObject('NewTable');
            obj2.set('a','a2');
            obj2.set('b','b2');
            var obj3=new CB.CloudObject('NewTable');
            obj3.set('a','a3');
            obj3.set('b','b3');
            var obj4=new CB.CloudObject('NewTable');
            obj4.set('a','a4');
            obj4.set('b','b4');
            CB.CloudObject.saveAll([obj1,obj2,obj3,obj4]).then(function(res){
                column = table.getColumn('a');
                column.name='anew';
                table.updateColumn(column);
                column = table.getColumn('b');
                column.name='bnew';
                table.updateColumn(column);
                //save updated table
                table.save().then(function(newTable){
                    var query=new CB.CloudQuery('NewTable');
                    query.find().then(function(obj){
                        var documentArr=obj.map(function(object){
                            return object.document
                        });
                        var keysArr=[];
                        documentArr.forEach(function(document){
                            keysArr.push(Object.keys(document));
                        })
                        var tableFields=[].concat.apply([],keysArr);                       
                        if(tableFields.indexOf('a')===-1&&tableFields.indexOf('b')===-1&&tableFields.indexOf('anew')!==-1&&tableFields.indexOf('bnew')!==-1)
                            done()
                        else
                            throw 'Column not updated'
                    },function(err){
                        throw err;
                    })                 
                },function(err){
                    throw err;
                })
                },function(err){
                    console.log(err);
            });
            

        },function(err){
            throw err;
        })

    });

    it("should create a column and then delete it",function(done){

        this.timeout(20000);

        CB.CloudTable.get('Employee').then(function(emp){
            var column = new CB.Column('Test2');
            emp.addColumn(column);
            emp.save().then(function(emp){
                emp.deleteColumn('Test2');
                emp.save().then(function(){
                    done();
                },function(err){
                   done(err);
                });
            },function(err){
                done(err);
            });
        },function(err){
            done(err);
        });
    });

    it("Should wait for other tests to run",function(done){

        this.timeout(100000);

        setTimeout(function(){
            done();
        },10000);

    });

    after(function() {
        CB.appKey = CB.jsKey;
    });

});