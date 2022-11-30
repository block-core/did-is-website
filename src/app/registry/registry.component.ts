import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { RegistrationService } from 'src/shared/registration.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import is from '@blockcore/did-resolver';
import { Resolver, DIDDocument, DIDResolutionResult } from 'did-resolver';
import { BlockcoreIdentityTools, BlockcoreIdentity } from '@blockcore/identity';

function sleep(durationInMillisecond: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationInMillisecond));
}

@Component({
  selector: 'app-registry-component',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
})
export class RegistryComponent implements OnInit, OnDestroy {
  private sub: any;

  address: string | undefined;
  identity: any;
  didDocument: DIDDocument | undefined;
  didResolutionResult: DIDResolutionResult | undefined;
  container: any;
  error: string | undefined;
  tools: BlockcoreIdentityTools;
  resolving = false;

  constructor(
    private route: ActivatedRoute,
    public reg: RegistrationService,
    public http: HttpClient
  ) {
    this.tools = new BlockcoreIdentityTools();
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(async (params) => {
      this.identity = undefined;
      this.didResolutionResult = undefined;
      this.address = params['address'];

      if (this.address) {
        this.resolving = true;
        await this.lookupIdentity(this.address);
      }

      // this.announcement = this.announcements.filter(a => a.number === this.number)[0];
    });
  }

  capitalize(word: string) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  getDate(timestamp: number) {
    return new Date(Number(timestamp) * 1000);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async lookupIdentity(identity: string) {
    // Adds support for lookup without the DID Method prefix:
    if (identity.indexOf(':') == -1) {
      identity = 'did:is:' + identity;
    }

    this.error = undefined;
    const resolver = new Resolver(is.getResolver());

    console.log('RESOLVING...');

    let result = null;

    try {
      result = await resolver.resolve(identity);
      console.log('RESOLVED!!', result);
      console.log('HERE?!?!?!?!');
      this.resolving = false;
      this.didResolutionResult = result;
    } catch (err) {
      this.resolving = false;
      console.error('NO!!', err);
    }

    if (!result) {
      this.error = 'Resolution unable to complete.';
      return;
    }

    if (result.didResolutionMetadata.error == 'notFound') {
      this.error = 'The identity was not found.';
      return;
    }

    if (result.didResolutionMetadata.error == 'invalidDid') {
      this.error = 'The identity ID was invalid.';
      return;
    }

    if (result.didResolutionMetadata.error == 'unsupportedDidMethod') {
      this.error =
        'Unsupported DID Method, only did:is is currently supported.';
      return;
    }

    if (result.didDocument) {
      if (
        result.didDocument &&
        result.didDocument.verificationMethod &&
        result.didDocument.verificationMethod[0] != null
      ) {
        const verificationMethod = result.didDocument.verificationMethod[0];
        this.identity = new BlockcoreIdentity(verificationMethod as any);
      }

      this.didDocument = result.didDocument;
      console.log(this.identity);
      console.log(this.didDocument);
    } else {
      this.error = result.didResolutionMetadata.error;
    }

    // this.http.get<any>(this.baseUrl + 'api/identity/' + identity).subscribe(result => {

    //   if (!result) {
    //     console.log('result is empty!!');
    //     this.error = 'Couldn\'t find any identity with that id.';
    //     return;
    //   }

    //   if (result.status === 401) {
    //     this.error = 'The service is currently not available, unauthorized"';
    //     return;
    //   }

    //   console.log('result is:');
    //   console.log(result);

    //   this.error = undefined;

    //   this.container = result;
    //   this.identity = result.content;

    //   // this.reg.registration.name = result.content.name;
    //   // this.reg.registration.id = result.content.id;
    //   // this.reg.registration.website = result.content.email;
    //   // this.reg.registration.address = result.content.shortName;

    //   // This will show the input form.
    //   // this.reg.registration.identity = result.content.id;

    // }, error => console.error(error));
  }
}
